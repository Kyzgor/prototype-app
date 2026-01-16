"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

// Signal texture options
export type SignalVariant = "burst" | "crystal" | "synapse";

const TEXTURE_PATHS: Record<SignalVariant, string> = {
  burst: "/signal-burst.jpg",
  crystal: "/signal-crystal.jpg",
  synapse: "/signal-synapse.jpg",
};

// Variant-specific animation presets
const VARIANT_PRESETS: Record<SignalVariant, {
  distortionStrength: number;
  flowSpeed: number;
  pulseSpeed: number;
  pulseIntensity: number;
  glitchIntensity: number;
  chromaticStrength: number;
  scanlineIntensity: number;
  flickerSpeed: number;
}> = {
  burst: {
    distortionStrength: 0.08,
    flowSpeed: 0.8,
    pulseSpeed: 1.5,
    pulseIntensity: 0.4,
    glitchIntensity: 0.6,
    chromaticStrength: 0.012,
    scanlineIntensity: 0.15,
    flickerSpeed: 8.0,
  },
  crystal: {
    distortionStrength: 0.05,
    flowSpeed: 0.5,
    pulseSpeed: 1.2,
    pulseIntensity: 0.35,
    glitchIntensity: 0.4,
    chromaticStrength: 0.008,
    scanlineIntensity: 0.1,
    flickerSpeed: 6.0,
  },
  synapse: {
    distortionStrength: 0.1,
    flowSpeed: 1.0,
    pulseSpeed: 1.8,
    pulseIntensity: 0.45,
    glitchIntensity: 0.5,
    chromaticStrength: 0.015,
    scanlineIntensity: 0.12,
    flickerSpeed: 10.0,
  },
};

// Simplex noise for organic movement
const noiseGLSL = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // Random function for glitch effects
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
`;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  ${noiseGLSL}

  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uDistortionStrength;
  uniform float uFlowSpeed;
  uniform float uPulseSpeed;
  uniform float uPulseIntensity;
  uniform float uGlitchIntensity;
  uniform float uChromaticStrength;
  uniform float uScanlineIntensity;
  uniform float uFlickerSpeed;
  uniform vec2 uMouse;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float time = uTime * uFlowSpeed;

    // === GLITCH DISPLACEMENT ===
    // Random horizontal glitch bands
    float glitchLine = step(0.97, random(vec2(floor(uTime * uFlickerSpeed), floor(uv.y * 20.0))));
    float glitchOffset = (random(vec2(uTime * 0.1, floor(uv.y * 30.0))) - 0.5) * 0.1 * uGlitchIntensity * glitchLine;

    // Occasional full-frame glitch
    float frameGlitch = step(0.992, random(vec2(floor(uTime * 3.0), 0.0)));
    glitchOffset += (random(vec2(uTime, uv.y)) - 0.5) * 0.05 * frameGlitch * uGlitchIntensity;

    // === ORGANIC FLOW DISTORTION ===
    float noise1 = snoise(vec3(uv * 1.5, time * 0.4));
    float noise2 = snoise(vec3(uv * 3.0 + 100.0, time * 0.6));
    float noise3 = snoise(vec3(uv * 0.8 + 200.0, time * 0.25));

    vec2 flowDistortion = vec2(
      noise1 * 0.4 + noise2 * 0.35 + noise3 * 0.25,
      noise1 * 0.35 + noise2 * 0.4 + noise3 * 0.25
    ) * uDistortionStrength;

    // === SIGNAL INSTABILITY - jittery micro-movements ===
    float jitter = snoise(vec3(uv * 10.0, uTime * 15.0)) * 0.003 * uGlitchIntensity;

    // Apply distortions
    vec2 distortedUv = uv + flowDistortion + vec2(glitchOffset + jitter, jitter * 0.5);

    // === CHROMATIC ABERRATION ===
    float chromaOffset = uChromaticStrength * (1.0 + sin(uTime * 2.0) * 0.5);
    // Increase aberration during glitch moments
    chromaOffset *= (1.0 + glitchLine * 3.0 + frameGlitch * 5.0);

    vec2 redOffset = vec2(chromaOffset, 0.0);
    vec2 blueOffset = vec2(-chromaOffset, 0.0);

    float r = texture2D(uTexture, distortedUv + redOffset).r;
    float g = texture2D(uTexture, distortedUv).g;
    float b = texture2D(uTexture, distortedUv + blueOffset).b;

    vec3 texColor = vec3(r, g, b);

    // === PULSING / BREATHING ===
    float pulse = 1.0 + sin(uTime * uPulseSpeed) * uPulseIntensity;
    float pulse2 = 1.0 + sin(uTime * uPulseSpeed * 0.7 + 1.5) * uPulseIntensity * 0.6;
    float pulse3 = 1.0 + sin(uTime * uPulseSpeed * 1.4 + 3.0) * uPulseIntensity * 0.3;

    // === FLICKER EFFECT ===
    float flicker = 1.0;
    float flickerRand = random(vec2(floor(uTime * uFlickerSpeed * 2.0), 0.0));
    if (flickerRand > 0.96) {
      flicker = 0.7 + random(vec2(uTime, 0.0)) * 0.3;
    }
    if (flickerRand > 0.99) {
      flicker = 0.3 + random(vec2(uTime * 2.0, 0.0)) * 0.4;
    }

    // === SCANLINES ===
    float scanline = sin(uv.y * 400.0 + uTime * 2.0) * 0.5 + 0.5;
    scanline = mix(1.0, scanline, uScanlineIntensity);

    // Moving scanline band
    float scanBand = smoothstep(0.0, 0.02, abs(fract(uv.y - uTime * 0.1) - 0.5));
    scanBand = mix(0.85, 1.0, scanBand) * mix(1.0, 0.9, uScanlineIntensity);

    // === COLOR ENHANCEMENT ===
    float luminance = dot(texColor, vec3(0.299, 0.587, 0.114));
    vec3 enhancedColor = texColor * (1.0 + luminance * 0.4 * pulse);

    // Signal color shift - unstable transmission feel
    float colorShift = sin(uTime * 0.4) * 0.15;
    enhancedColor.r *= 1.0 + colorShift * pulse2;
    enhancedColor.b *= 1.0 - colorShift * 0.5;

    // Bloom on bright areas
    float glow = smoothstep(0.25, 0.7, luminance) * pulse2 * 0.35;
    float coreGlow = smoothstep(0.6, 0.95, luminance) * pulse3 * 0.25;
    enhancedColor += texColor * glow;
    enhancedColor += vec3(1.0, 0.95, 1.0) * coreGlow * luminance;

    // === APPLY ALL EFFECTS ===
    vec3 finalColor = enhancedColor * scanline * scanBand * flicker;

    // Vignette
    float vignette = 1.0 - smoothstep(0.4, 1.0, length(uv - 0.5) * 1.1);

    // Alpha based on luminance
    float alpha = smoothstep(0.015, 0.1, luminance) * vignette * pulse2 * flicker;

    // Signal interference noise overlay
    float signalNoise = random(uv + uTime) * 0.03 * uGlitchIntensity;
    finalColor += vec3(signalNoise) * luminance;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

interface SignalPlaneProps {
  texturePath: string;
  preset: typeof VARIANT_PRESETS[SignalVariant];
  scale?: number;
  chaosLevel?: number;
}

function SignalPlane({ texturePath, preset, scale = 1, chaosLevel = 0 }: SignalPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const { viewport } = useThree();

  const texture = useTexture(texturePath);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uDistortionStrength: { value: preset.distortionStrength },
      uFlowSpeed: { value: preset.flowSpeed },
      uPulseSpeed: { value: preset.pulseSpeed },
      uPulseIntensity: { value: preset.pulseIntensity },
      uGlitchIntensity: { value: preset.glitchIntensity },
      uChromaticStrength: { value: preset.chromaticStrength },
      uScanlineIntensity: { value: preset.scanlineIntensity },
      uFlickerSpeed: { value: preset.flickerSpeed },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uChaosLevel: { value: 0 },
    }),
    [texture, preset]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

      // Update chaos level for real-time animation
      materialRef.current.uniforms.uChaosLevel.value = chaosLevel;

      // Chaos multipliers - dramatically increase all effects
      const chaosMult = 1 + chaosLevel * 4; // Up to 5x intensity
      materialRef.current.uniforms.uDistortionStrength.value = preset.distortionStrength * chaosMult;
      materialRef.current.uniforms.uFlowSpeed.value = preset.flowSpeed * (1 + chaosLevel * 3);
      materialRef.current.uniforms.uGlitchIntensity.value = preset.glitchIntensity * chaosMult;
      materialRef.current.uniforms.uChromaticStrength.value = preset.chromaticStrength * (1 + chaosLevel * 6);
      materialRef.current.uniforms.uFlickerSpeed.value = preset.flickerSpeed * (1 + chaosLevel * 2);
      materialRef.current.uniforms.uPulseSpeed.value = preset.pulseSpeed * (1 + chaosLevel * 2);
      materialRef.current.uniforms.uPulseIntensity.value = preset.pulseIntensity * (1 + chaosLevel * 2);

      const targetX = (state.pointer.x + 1) / 2;
      const targetY = (state.pointer.y + 1) / 2;
      mousePos.current.x += (targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (targetY - mousePos.current.y) * 0.05;
      materialRef.current.uniforms.uMouse.value.set(mousePos.current.x, mousePos.current.y);
    }
  });

  const planeScale = Math.max(viewport.width, viewport.height) * scale * 1.2;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[planeScale, planeScale]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function SignalLayers({ variant, chaosLevel = 0 }: { variant: SignalVariant; chaosLevel?: number }) {
  const texturePath = TEXTURE_PATHS[variant];
  const preset = VARIANT_PRESETS[variant];

  // Create slightly modified presets for layering
  const bgPreset = {
    ...preset,
    distortionStrength: preset.distortionStrength * 0.6,
    flowSpeed: preset.flowSpeed * 0.7,
    glitchIntensity: preset.glitchIntensity * 0.4,
  };

  return (
    <group>
      {/* Background layer - slower, subtler */}
      <SignalPlane texturePath={texturePath} preset={bgPreset} scale={1.3} chaosLevel={chaosLevel} />
      {/* Main layer */}
      <SignalPlane texturePath={texturePath} preset={preset} scale={1.0} chaosLevel={chaosLevel} />
    </group>
  );
}

interface SignalBackgroundProps {
  variant: SignalVariant;
  intensity?: number; // 0-1, controls overall brightness
  chaosLevel?: number; // 0-1, intensifies all effects for chaos phase
  explodeScale?: number; // 1 = normal, higher = zoomed in (for explosion effect)
  onReady?: () => void;
}

function Scene({ variant, chaosLevel = 0, onReady }: SignalBackgroundProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onReady?.();
    }, 100);
    return () => clearTimeout(timer);
  }, [variant, onReady]);

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <SignalLayers variant={variant} chaosLevel={chaosLevel} />
    </>
  );
}

export function SignalBackground({ variant, intensity = 1, chaosLevel = 0, explodeScale = 1, onReady }: SignalBackgroundProps) {
  return (
    <div
      className="fixed inset-0 -z-10 transition-opacity duration-300 ease-in-out origin-center"
      style={{
        opacity: intensity,
        transform: `scale(${explodeScale})`,
        transition: explodeScale > 1 ? "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)" : "opacity 0.3s ease-in-out",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        <Scene variant={variant} chaosLevel={chaosLevel} onReady={onReady} />
      </Canvas>
    </div>
  );
}

// === BACKGROUND SWITCHER COMPONENT ===

interface BackgroundSwitcherProps {
  currentVariant: SignalVariant;
  onSwitch: (variant: SignalVariant) => void;
}

const VARIANT_LABELS: Record<SignalVariant, string> = {
  burst: "SIGNAL I",
  crystal: "SIGNAL II",
  synapse: "SIGNAL III",
};

export function BackgroundSwitcher({ currentVariant, onSwitch }: BackgroundSwitcherProps) {
  return (
    <div className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 flex gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-lg glass border border-violet/20">
      {(Object.keys(VARIANT_LABELS) as SignalVariant[]).map((variant) => (
        <button
          key={variant}
          onClick={() => onSwitch(variant)}
          className={`
            px-2 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-display tracking-[0.08em] sm:tracking-[0.15em] uppercase transition-all duration-300
            ${currentVariant === variant
              ? "bg-violet/30 text-foreground glow-violet"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }
            rounded-md
          `}
        >
          {VARIANT_LABELS[variant]}
        </button>
      ))}
    </div>
  );
}

// Export types and constants for external use
export { VARIANT_LABELS, TEXTURE_PATHS, VARIANT_PRESETS };
