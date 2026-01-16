"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

// Simplex noise function for smooth organic movement
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
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
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
  uniform vec2 uMouse;
  uniform float uMouseInfluence;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // Primary flowing distortion - large scale waves
    float time = uTime * uFlowSpeed;
    float noise1 = snoise(vec3(uv * 1.5, time * 0.4));
    float noise2 = snoise(vec3(uv * 3.0 + 100.0, time * 0.6));
    float noise3 = snoise(vec3(uv * 0.8 + 200.0, time * 0.25));

    // Secondary turbulence layer - faster, smaller details
    float turb1 = snoise(vec3(uv * 5.0, time * 0.8));
    float turb2 = snoise(vec3(uv * 8.0 + 50.0, time * 1.0));

    // Directional flow - energy flows upward and to the right
    float flowAngle = time * 0.15;
    vec2 flowDir = vec2(cos(flowAngle) * 0.3, sin(flowAngle) * 0.3 + 0.5);
    float directionalFlow = snoise(vec3(uv * 2.0 + flowDir * time * 0.5, time * 0.3));

    // Combine all noise layers for complex organic flow
    vec2 distortion = vec2(
      noise1 * 0.4 + noise2 * 0.3 + noise3 * 0.3 + turb1 * 0.15 + directionalFlow * 0.2,
      noise1 * 0.3 + noise2 * 0.4 + noise3 * 0.3 + turb2 * 0.15 + directionalFlow * 0.25
    ) * uDistortionStrength;

    // Swirling motion
    float swirl = snoise(vec3(uv * 2.0, time * 0.5)) * 0.02 * uDistortionStrength;
    vec2 swirlOffset = vec2(
      cos(swirl * 6.28) - 1.0,
      sin(swirl * 6.28)
    ) * length(uv - 0.5);

    // Mouse influence - energy reacts to cursor
    float mouseDist = length(uv - uMouse);
    vec2 mouseDistortion = normalize(uv - uMouse + 0.001) * (1.0 - smoothstep(0.0, 0.4, mouseDist)) * 0.05 * uMouseInfluence;

    // Apply all distortions
    vec2 distortedUv = uv + distortion + swirlOffset + mouseDistortion;

    // Sample the texture
    vec4 texColor = texture2D(uTexture, distortedUv);

    // Multi-frequency pulsing for organic breathing
    float pulse = 1.0 + sin(uTime * uPulseSpeed) * uPulseIntensity;
    float pulse2 = 1.0 + sin(uTime * uPulseSpeed * 0.7 + 1.5) * uPulseIntensity * 0.7;
    float pulse3 = 1.0 + sin(uTime * uPulseSpeed * 1.3 + 3.0) * uPulseIntensity * 0.4;

    // Luminance for intensity mapping
    float luminance = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));

    // Dynamic color enhancement - brighter areas pulse more
    vec3 enhancedColor = texColor.rgb * (1.0 + luminance * 0.5 * pulse);

    // Color cycling - shifts between violet and gold tones
    float colorShift = sin(uTime * 0.3) * 0.12;
    float colorShift2 = cos(uTime * 0.2 + 1.0) * 0.08;
    enhancedColor.r *= 1.0 + colorShift;
    enhancedColor.g *= 1.0 + colorShift2 * 0.5;
    enhancedColor.b *= 1.0 - colorShift * 0.3;

    // Bloom/glow on bright areas
    float glow = smoothstep(0.2, 0.7, luminance) * pulse2 * 0.4;
    float coreGlow = smoothstep(0.5, 0.9, luminance) * pulse3 * 0.3;
    enhancedColor += texColor.rgb * glow;
    enhancedColor += vec3(1.0, 0.9, 1.0) * coreGlow * luminance;

    // Soft vignette
    float vignette = 1.0 - smoothstep(0.4, 1.0, length(uv - 0.5) * 1.1);

    // Alpha based on luminance - black is transparent
    float alpha = smoothstep(0.02, 0.12, luminance) * vignette * pulse2;

    gl_FragColor = vec4(enhancedColor, alpha);
  }
`;

interface EnergyFlowPlaneProps {
  distortionStrength?: number;
  flowSpeed?: number;
  pulseSpeed?: number;
  pulseIntensity?: number;
  mouseInfluence?: number;
  opacity?: number;
  scale?: number;
}

function EnergyFlowPlane({
  distortionStrength = 0.03,
  flowSpeed = 0.4,
  pulseSpeed = 0.8,
  pulseIntensity = 0.15,
  mouseInfluence = 0.3,
  opacity = 0.85,
  scale = 1,
}: EnergyFlowPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const { viewport } = useThree();

  const texture = useTexture("/energy-flow.jpg");

  // Configure texture
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uDistortionStrength: { value: distortionStrength },
      uFlowSpeed: { value: flowSpeed },
      uPulseSpeed: { value: pulseSpeed },
      uPulseIntensity: { value: pulseIntensity },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseInfluence: { value: mouseInfluence },
    }),
    [texture, distortionStrength, flowSpeed, pulseSpeed, pulseIntensity, mouseInfluence]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

      // Smooth mouse following
      const targetX = (state.pointer.x + 1) / 2;
      const targetY = (state.pointer.y + 1) / 2;
      mousePos.current.x += (targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (targetY - mousePos.current.y) * 0.05;
      materialRef.current.uniforms.uMouse.value.set(mousePos.current.x, mousePos.current.y);
    }
  });

  // Calculate plane size to cover viewport
  const planeScale = Math.max(viewport.width, viewport.height) * scale * 1.2;

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
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

// Second layer with different timing for depth
function EnergyFlowLayered() {
  return (
    <group>
      {/* Background layer - slower, drifting */}
      <EnergyFlowPlane
        distortionStrength={0.06}
        flowSpeed={0.6}
        pulseSpeed={0.7}
        pulseIntensity={0.25}
        mouseInfluence={0.2}
        opacity={0.6}
        scale={1.4}
      />
      {/* Main layer - more active */}
      <EnergyFlowPlane
        distortionStrength={0.1}
        flowSpeed={1.0}
        pulseSpeed={1.2}
        pulseIntensity={0.35}
        mouseInfluence={0.5}
        opacity={1.0}
        scale={1.0}
      />
    </group>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <EnergyFlowLayered />
    </>
  );
}

export function EnergyFlowBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

// Export a combined version that layers with existing cosmic background
export function EnergyFlowWithParticles() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        <color attach="background" args={["#0a0a12"]} />
        <EnergyFlowLayered />
      </Canvas>
    </div>
  );
}
