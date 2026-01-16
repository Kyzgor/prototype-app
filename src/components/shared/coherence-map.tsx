"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlitchText } from "@/components/shared/glitch-text";

export type CoherenceVariant = "geometry" | "neural" | "waveform" | "energy";

interface CoherenceMapProps {
  variant: CoherenceVariant;
  onStabilized?: () => void;
}

interface Signature {
  id: string;
  x: number;
  y: number;
  timestamp: number;
  isUser?: boolean;
}

// ============================================================================
// VARIANT 1: SACRED GEOMETRY - Flower of Life pattern
// ============================================================================
function SacredGeometryMap({
  stability,
  signatures
}: {
  stability: number;
  signatures: Signature[];
}) {
  const circles = useMemo(() => {
    // Flower of Life pattern - 19 interlocking circles
    const baseCircles = [];
    const centerX = 200;
    const centerY = 200;
    const radius = 40;

    // Center circle
    baseCircles.push({ cx: centerX, cy: centerY, delay: 0 });

    // First ring - 6 circles
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      baseCircles.push({
        cx: centerX + radius * Math.cos(angle),
        cy: centerY + radius * Math.sin(angle),
        delay: 0.1 + i * 0.05,
      });
    }

    // Second ring - 12 circles
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12 + Math.PI / 12;
      const dist = radius * 1.73;
      baseCircles.push({
        cx: centerX + dist * Math.cos(angle),
        cy: centerY + dist * Math.sin(angle),
        delay: 0.3 + i * 0.04,
      });
    }

    return baseCircles;
  }, []);

  return (
    <svg viewBox="0 0 400 400" className="w-full h-full">
      <defs>
        <filter id="glow-geometry">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="geometry-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* Background pulse */}
      <circle
        cx="200"
        cy="200"
        r={150 + stability * 30}
        fill="none"
        stroke="url(#geometry-gradient)"
        strokeWidth="1"
        opacity={0.1 + stability * 0.2}
        filter="url(#glow-geometry)"
      />

      {/* Flower of Life circles */}
      {circles.map((circle, i) => {
        const activeThreshold = i / circles.length;
        const isActive = stability > activeThreshold;
        const intensity = isActive ? Math.min(1, (stability - activeThreshold) * 3) : 0;

        return (
          <g key={i}>
            {/* Outer glow */}
            <circle
              cx={circle.cx}
              cy={circle.cy}
              r={40}
              fill="none"
              stroke="#a855f7"
              strokeWidth={1 + intensity * 2}
              opacity={intensity * 0.5}
              filter="url(#glow-geometry)"
            />
            {/* Main circle */}
            <circle
              cx={circle.cx}
              cy={circle.cy}
              r={40}
              fill="none"
              stroke={isActive ? "#a855f7" : "#2a2a3a"}
              strokeWidth={isActive ? 1.5 : 0.5}
              opacity={isActive ? 0.4 + intensity * 0.6 : 0.15}
              style={{
                transition: `all 0.8s ease-out ${circle.delay}s`,
              }}
            />
          </g>
        );
      })}

      {/* Signature points */}
      {signatures.map((sig) => (
        <g key={sig.id}>
          <circle
            cx={sig.x * 400}
            cy={sig.y * 400}
            r={sig.isUser ? 8 : 4}
            fill={sig.isUser ? "#f59e0b" : "#a855f7"}
            opacity={0.8}
            filter="url(#glow-geometry)"
          >
            <animate
              attributeName="r"
              values={sig.isUser ? "8;12;8" : "4;6;4"}
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}

      {/* Center focal point */}
      <circle
        cx="200"
        cy="200"
        r={5 + stability * 15}
        fill="url(#geometry-gradient)"
        opacity={0.3 + stability * 0.7}
        filter="url(#glow-geometry)"
      >
        <animate
          attributeName="opacity"
          values={`${0.3 + stability * 0.5};${0.5 + stability * 0.5};${0.3 + stability * 0.5}`}
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

// ============================================================================
// VARIANT 2: NEURAL NETWORK - Nodes and synaptic connections
// ============================================================================
function NeuralNetworkMap({
  stability,
  signatures
}: {
  stability: number;
  signatures: Signature[];
}) {
  const nodes = useMemo(() => {
    const result = [];
    // Generate nodes in a more organic pattern
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2 + Math.random() * 0.5;
      const radius = 50 + Math.random() * 130;
      result.push({
        id: i,
        x: 200 + Math.cos(angle) * radius,
        y: 200 + Math.sin(angle) * radius,
        size: 3 + Math.random() * 4,
        connections: [] as number[],
      });
    }

    // Create connections based on proximity
    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        const dx = result[i].x - result[j].x;
        const dy = result[i].y - result[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80 && result[i].connections.length < 4) {
          result[i].connections.push(j);
        }
      }
    }

    return result;
  }, []);

  return (
    <svg viewBox="0 0 400 400" className="w-full h-full">
      <defs>
        <filter id="glow-neural">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Connections */}
      {nodes.map((node) =>
        node.connections.map((targetIdx) => {
          const target = nodes[targetIdx];
          const connectionThreshold = (node.id + targetIdx) / (nodes.length * 2);
          const isActive = stability > connectionThreshold;
          const intensity = isActive ? Math.min(1, (stability - connectionThreshold) * 4) : 0;

          return (
            <line
              key={`${node.id}-${targetIdx}`}
              x1={node.x}
              y1={node.y}
              x2={target.x}
              y2={target.y}
              stroke="#a855f7"
              strokeWidth={0.5 + intensity * 1.5}
              opacity={isActive ? 0.2 + intensity * 0.6 : 0.05}
              filter={isActive ? "url(#glow-neural)" : undefined}
              style={{ transition: "all 0.5s ease-out" }}
            />
          );
        })
      )}

      {/* Nodes */}
      {nodes.map((node) => {
        const nodeThreshold = node.id / nodes.length;
        const isActive = stability > nodeThreshold * 0.8;
        const intensity = isActive ? Math.min(1, (stability - nodeThreshold * 0.8) * 3) : 0;

        return (
          <g key={node.id}>
            {/* Pulse ring */}
            {isActive && (
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size * 2}
                fill="none"
                stroke="#a855f7"
                strokeWidth="1"
                opacity={intensity * 0.3}
              >
                <animate
                  attributeName="r"
                  values={`${node.size * 2};${node.size * 4};${node.size * 2}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values={`${intensity * 0.3};0;${intensity * 0.3}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            {/* Core node */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill={isActive ? "#a855f7" : "#2a2a3a"}
              opacity={isActive ? 0.5 + intensity * 0.5 : 0.2}
              filter={isActive ? "url(#glow-neural)" : undefined}
              style={{ transition: "all 0.4s ease-out" }}
            />
          </g>
        );
      })}

      {/* Signature points as bright nodes */}
      {signatures.map((sig) => (
        <g key={sig.id}>
          <circle
            cx={sig.x * 400}
            cy={sig.y * 400}
            r={sig.isUser ? 10 : 6}
            fill={sig.isUser ? "#f59e0b" : "#06b6d4"}
            opacity={0.9}
            filter="url(#glow-neural)"
          >
            <animate
              attributeName="r"
              values={sig.isUser ? "10;14;10" : "6;8;6"}
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}

      {/* Central nexus */}
      <circle
        cx="200"
        cy="200"
        r={10 + stability * 20}
        fill="#7c3aed"
        opacity={0.2 + stability * 0.4}
        filter="url(#glow-neural)"
      />
    </svg>
  );
}

// ============================================================================
// VARIANT 3: WAVEFORM - Synchronizing frequency waves
// ============================================================================
function WaveformMap({
  stability,
  signatures
}: {
  stability: number;
  signatures: Signature[];
}) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 0.05);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const waves = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => ({
      id: i,
      baseFreq: 0.5 + i * 0.15,
      baseAmp: 30 + i * 5,
      phase: i * 0.7,
      color: i % 2 === 0 ? "#a855f7" : "#7c3aed",
      yOffset: 80 + i * 40,
    }));
  }, []);

  const generateWavePath = (wave: typeof waves[0], stability: number, time: number) => {
    const points = [];
    const chaos = 1 - stability;

    for (let x = 0; x <= 400; x += 4) {
      // Target synchronized wave
      const syncY = Math.sin((x * 0.02 * wave.baseFreq) + time + wave.phase) * wave.baseAmp;

      // Chaotic interference
      const noise1 = Math.sin(x * 0.05 + time * 2.3 + wave.id) * 20 * chaos;
      const noise2 = Math.sin(x * 0.08 + time * 1.7 - wave.id * 0.5) * 15 * chaos;
      const noise3 = Math.sin(x * 0.12 + time * 3.1) * 10 * chaos;

      const y = wave.yOffset + syncY + noise1 + noise2 + noise3;
      points.push(`${x},${y}`);
    }

    return `M ${points.join(" L ")}`;
  };

  return (
    <svg viewBox="0 0 400 400" className="w-full h-full">
      <defs>
        <filter id="glow-wave">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
          <stop offset="20%" stopColor="#a855f7" stopOpacity="1" />
          <stop offset="80%" stopColor="#7c3aed" stopOpacity="1" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Background grid lines */}
      {[100, 150, 200, 250, 300].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="400"
          y2={y}
          stroke="#2a2a3a"
          strokeWidth="0.5"
          opacity={0.3}
        />
      ))}

      {/* Waves */}
      {waves.map((wave) => (
        <path
          key={wave.id}
          d={generateWavePath(wave, stability, time)}
          fill="none"
          stroke={wave.color}
          strokeWidth={1 + stability * 1.5}
          opacity={0.3 + stability * 0.5}
          filter="url(#glow-wave)"
        />
      ))}

      {/* Signature markers on waves */}
      {signatures.map((sig) => {
        const waveIdx = Math.floor(sig.y * waves.length);
        const wave = waves[Math.min(waveIdx, waves.length - 1)];
        const x = sig.x * 400;
        const syncY = Math.sin((x * 0.02 * wave.baseFreq) + time + wave.phase) * wave.baseAmp;
        const y = wave.yOffset + syncY * stability + (1 - stability) * (sig.y * 100 - 50);

        return (
          <circle
            key={sig.id}
            cx={x}
            cy={y}
            r={sig.isUser ? 8 : 5}
            fill={sig.isUser ? "#f59e0b" : "#06b6d4"}
            opacity={0.9}
            filter="url(#glow-wave)"
          />
        );
      })}

      {/* Coherence indicator bar */}
      <rect
        x="50"
        y="370"
        width={300 * stability}
        height="4"
        fill="url(#wave-gradient)"
        opacity={0.8}
        filter="url(#glow-wave)"
      />
      <rect
        x="50"
        y="370"
        width="300"
        height="4"
        fill="none"
        stroke="#2a2a3a"
        strokeWidth="1"
        opacity={0.5}
      />
    </svg>
  );
}

// ============================================================================
// VARIANT 4: ENERGY FIELD - Abstract coalescing energy
// ============================================================================
function EnergyFieldMap({
  stability,
  signatures
}: {
  stability: number;
  signatures: Signature[];
}) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 0.03);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const particles = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      baseAngle: (i / 50) * Math.PI * 2,
      baseRadius: 80 + (i % 5) * 25,
      speed: 0.3 + Math.random() * 0.4,
      size: 2 + Math.random() * 3,
      orbitOffset: Math.random() * Math.PI * 2,
    }));
  }, []);

  const getParticlePosition = (particle: typeof particles[0], stability: number, time: number) => {
    const chaos = 1 - stability;

    // Chaotic scattered position
    const chaoticAngle = particle.baseAngle + Math.sin(time * particle.speed + particle.orbitOffset) * 2 * chaos;
    const chaoticRadius = particle.baseRadius + Math.sin(time * 0.7 + particle.id) * 50 * chaos;

    // Stable orbital position
    const stableAngle = particle.baseAngle + time * 0.2;
    const stableRadius = particle.baseRadius;

    // Interpolate
    const angle = chaoticAngle * chaos + stableAngle * stability;
    const radius = chaoticRadius * chaos + stableRadius * stability;

    return {
      x: 200 + Math.cos(angle) * radius,
      y: 200 + Math.sin(angle) * radius,
    };
  };

  return (
    <svg viewBox="0 0 400 400" className="w-full h-full">
      <defs>
        <filter id="glow-energy">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <radialGradient id="energy-center" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity={0.6 * stability} />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Orbital rings */}
      {[80, 105, 130, 155, 180].map((r, i) => (
        <circle
          key={r}
          cx="200"
          cy="200"
          r={r}
          fill="none"
          stroke="#a855f7"
          strokeWidth={0.5 + stability * 0.5}
          opacity={0.1 + stability * 0.2}
          strokeDasharray={stability > 0.8 ? "none" : `${5 + i * 2} ${10 - stability * 8}`}
        />
      ))}

      {/* Energy particles */}
      {particles.map((particle) => {
        const pos = getParticlePosition(particle, stability, time);
        const intensity = 0.3 + stability * 0.7;

        return (
          <circle
            key={particle.id}
            cx={pos.x}
            cy={pos.y}
            r={particle.size * (0.8 + stability * 0.4)}
            fill="#a855f7"
            opacity={intensity}
            filter="url(#glow-energy)"
          />
        );
      })}

      {/* Central energy mass */}
      <circle
        cx="200"
        cy="200"
        r={30 + stability * 40}
        fill="url(#energy-center)"
        filter="url(#glow-energy)"
      />

      {/* Inner core */}
      <circle
        cx="200"
        cy="200"
        r={10 + stability * 15}
        fill="#f59e0b"
        opacity={0.3 + stability * 0.5}
        filter="url(#glow-energy)"
      >
        <animate
          attributeName="r"
          values={`${10 + stability * 15};${15 + stability * 20};${10 + stability * 15}`}
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Signature markers */}
      {signatures.map((sig) => {
        // Signatures orbit closer to center as stability increases
        const sigRadius = (1 - stability) * 150 + 50;
        const sigAngle = sig.x * Math.PI * 2 + time * 0.3;
        const x = 200 + Math.cos(sigAngle) * sigRadius * sig.y;
        const y = 200 + Math.sin(sigAngle) * sigRadius * sig.y;

        return (
          <circle
            key={sig.id}
            cx={x}
            cy={y}
            r={sig.isUser ? 10 : 6}
            fill={sig.isUser ? "#f59e0b" : "#06b6d4"}
            opacity={0.9}
            filter="url(#glow-energy)"
          />
        );
      })}
    </svg>
  );
}

// ============================================================================
// MAIN COHERENCE MAP COMPONENT
// ============================================================================
export function CoherenceMap({ variant, onStabilized }: CoherenceMapProps) {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [stability, setStability] = useState(0);
  const [userSigned, setUserSigned] = useState(false);
  const [isStabilized, setIsStabilized] = useState(false);
  const stabilizedRef = useRef(false);

  // Simulate other signatures joining over time
  useEffect(() => {
    if (!userSigned) return;

    const interval = setInterval(() => {
      // Add a new signature every 2-4 seconds
      if (Math.random() > 0.3) {
        const newSig: Signature = {
          id: `sig-${Date.now()}-${Math.random()}`,
          x: 0.15 + Math.random() * 0.7,
          y: 0.15 + Math.random() * 0.7,
          timestamp: Date.now(),
          isUser: false,
        };
        setSignatures(prev => [...prev, newSig]);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [userSigned]);

  // Calculate stability based on signatures
  useEffect(() => {
    if (signatures.length === 0) {
      setStability(0);
      return;
    }

    // Target: ~20 signatures for full stability over ~50 seconds
    const targetSignatures = 20;
    const newStability = Math.min(1, signatures.length / targetSignatures);

    // Smooth transition
    setStability(prev => prev + (newStability - prev) * 0.1);
  }, [signatures]);

  // Smooth stability animation
  useEffect(() => {
    if (stability >= 0.98 && !stabilizedRef.current) {
      stabilizedRef.current = true;
      setIsStabilized(true);
      setTimeout(() => {
        onStabilized?.();
      }, 2000); // Wait 2s after stabilization before callback
    }
  }, [stability, onStabilized]);

  const handleSign = useCallback(() => {
    if (userSigned) return;

    setUserSigned(true);
    const userSignature: Signature = {
      id: "user-signature",
      x: 0.5,
      y: 0.5,
      timestamp: Date.now(),
      isUser: true,
    };
    setSignatures([userSignature]);
  }, [userSigned]);

  const MapComponent = {
    geometry: SacredGeometryMap,
    neural: NeuralNetworkMap,
    waveform: WaveformMap,
    energy: EnergyFieldMap,
  }[variant];

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-4 sm:px-0">
      {/* Coherence visualization */}
      <motion.div
        className="w-full aspect-square max-w-xs sm:max-w-md mb-6 sm:mb-8 relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <MapComponent stability={stability} signatures={signatures} />

        {/* Stability percentage overlay */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 text-center">
          <div className="text-xs sm:text-label text-muted-foreground mb-0.5 sm:mb-1">COHERENCE</div>
          <div className="text-lg sm:text-display-md text-violet font-display">
            {Math.round(stability * 100)}%
          </div>
        </div>
      </motion.div>

      {/* Status text */}
      <motion.div
        className="text-center mb-6 sm:mb-8 px-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {!userSigned ? (
          <p className="text-sm sm:text-body text-muted-foreground">
            <GlitchText intensity="low">
              The signal awaits your resonance
            </GlitchText>
          </p>
        ) : isStabilized ? (
          <p className="text-sm sm:text-body text-gold text-glow">
            <GlitchText intensity="low">
              Coherence achieved. The signal is stable.
            </GlitchText>
          </p>
        ) : (
          <p className="text-sm sm:text-body text-muted-foreground">
            <GlitchText intensity="medium">
              {signatures.length} resonance{signatures.length !== 1 ? "s" : ""} detected...
              {stability < 0.3 && " Signal unstable"}
              {stability >= 0.3 && stability < 0.6 && " Patterns emerging"}
              {stability >= 0.6 && stability < 0.9 && " Coherence forming"}
              {stability >= 0.9 && " Almost synchronized"}
            </GlitchText>
          </p>
        )}
      </motion.div>

      {/* Sign button */}
      <AnimatePresence mode="wait">
        {!userSigned && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              size="lg"
              onClick={handleSign}
              className="glow-violet hover:glow-gold transition-all duration-500 font-display tracking-[0.15em] text-base px-6 py-5 sm:text-lg sm:px-10 sm:py-7 h-auto uppercase border border-violet/20"
            >
              <GlitchText intensity="medium">
                Add Your Signature
              </GlitchText>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// VARIANT SWITCHER
// ============================================================================
const VARIANT_LABELS: Record<CoherenceVariant, string> = {
  geometry: "Sacred Geometry",
  neural: "Neural Network",
  waveform: "Waveform",
  energy: "Energy Field",
};

export function CoherenceMapSwitcher({
  currentVariant,
  onSwitch,
}: {
  currentVariant: CoherenceVariant;
  onSwitch: (variant: CoherenceVariant) => void;
}) {
  const variants: CoherenceVariant[] = ["geometry", "neural", "waveform", "energy"];

  return (
    <div className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 flex gap-0.5 sm:gap-2 p-0.5 sm:p-1 rounded-lg bg-abyss/80 backdrop-blur-sm border border-violet/20 max-w-[calc(100vw-1rem)] overflow-x-auto">
      {variants.map((variant) => (
        <button
          key={variant}
          onClick={() => onSwitch(variant)}
          className={`px-1.5 py-1 text-[9px] sm:px-3 sm:py-1.5 sm:text-sm font-display tracking-wide sm:tracking-wider uppercase transition-all duration-300 rounded whitespace-nowrap flex-shrink-0 ${
            currentVariant === variant
              ? "bg-violet/30 text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-violet/10"
          }`}
        >
          {VARIANT_LABELS[variant]}
        </button>
      ))}
    </div>
  );
}
