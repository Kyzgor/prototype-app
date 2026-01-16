"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface GlitchTextProps {
  children: React.ReactNode;
  className?: string;
  intensity?: "low" | "medium" | "high";
  active?: boolean;
}

interface GlitchState {
  offsetX: number;
  offsetY: number;
  opacity: number;
  skewX: number;
  scaleX: number;
  clipPath: string;
  isGlitching: boolean;
}

export function GlitchText({
  children,
  className = "",
  intensity = "medium",
  active = true,
}: GlitchTextProps) {
  const [glitchState, setGlitchState] = useState<GlitchState>({
    offsetX: 0,
    offsetY: 0,
    opacity: 1,
    skewX: 0,
    scaleX: 1,
    clipPath: "inset(0 0 0 0)",
    isGlitching: false,
  });

  // Intensity settings - much more aggressive
  const settings = {
    low: { chance: 0.08, maxOffset: 4, interval: 80, burstChance: 0.02 },
    medium: { chance: 0.15, maxOffset: 8, interval: 50, burstChance: 0.05 },
    high: { chance: 0.25, maxOffset: 15, interval: 30, burstChance: 0.1 },
  };

  const { chance, maxOffset, interval, burstChance } = settings[intensity];

  const triggerGlitch = useCallback((isBurst = false) => {
    const glitchIntensity = isBurst ? 2 : 1;
    const clipTop = Math.random() * 100;
    const clipBottom = clipTop + Math.random() * 30;

    setGlitchState({
      offsetX: (Math.random() - 0.5) * maxOffset * glitchIntensity,
      offsetY: (Math.random() - 0.5) * maxOffset * 0.5 * glitchIntensity,
      opacity: Math.random() > 0.2 ? 1 : Math.random() * 0.5 + 0.3,
      skewX: (Math.random() - 0.5) * 5 * glitchIntensity,
      scaleX: 1 + (Math.random() - 0.5) * 0.1 * glitchIntensity,
      clipPath: Math.random() > 0.5
        ? `inset(${clipTop}% 0 ${100 - clipBottom}% 0)`
        : "inset(0 0 0 0)",
      isGlitching: true,
    });
  }, [maxOffset]);

  const resetGlitch = useCallback(() => {
    setGlitchState({
      offsetX: 0,
      offsetY: 0,
      opacity: 1,
      skewX: 0,
      scaleX: 1,
      clipPath: "inset(0 0 0 0)",
      isGlitching: false,
    });
  }, []);

  useEffect(() => {
    if (!active) return;

    let glitchTimeout: NodeJS.Timeout;

    const glitchInterval = setInterval(() => {
      // Check for burst glitch (multiple rapid glitches)
      if (Math.random() < burstChance) {
        // Burst mode - rapid fire glitches
        let burstCount = 0;
        const burstMax = Math.floor(Math.random() * 5) + 3;

        const doBurst = () => {
          if (burstCount < burstMax) {
            triggerGlitch(true);
            burstCount++;
            glitchTimeout = setTimeout(() => {
              resetGlitch();
              setTimeout(doBurst, 30 + Math.random() * 50);
            }, 40 + Math.random() * 60);
          }
        };
        doBurst();
      } else if (Math.random() < chance) {
        // Normal single glitch
        triggerGlitch(false);

        glitchTimeout = setTimeout(() => {
          resetGlitch();
        }, 50 + Math.random() * 100);
      }
    }, interval);

    return () => {
      clearInterval(glitchInterval);
      clearTimeout(glitchTimeout);
    };
  }, [active, chance, interval, burstChance, triggerGlitch, resetGlitch]);

  return (
    <span className={`relative inline-block ${className}`}>
      {/* Main text */}
      <motion.span
        className="relative z-10"
        animate={{
          x: glitchState.offsetX,
          y: glitchState.offsetY,
          opacity: glitchState.opacity,
          skewX: glitchState.skewX,
          scaleX: glitchState.scaleX,
        }}
        transition={{ duration: 0.03 }}
      >
        {children}
      </motion.span>

      {/* Chromatic aberration layers - always rendered when active */}
      {active && (
        <>
          {/* Red/magenta channel offset */}
          <motion.span
            className="absolute inset-0 z-0"
            style={{
              color: "rgba(255, 50, 100, 0.4)",
              mixBlendMode: "screen",
            }}
            animate={{
              x: glitchState.isGlitching ? glitchState.offsetX * 2 : 1,
              y: glitchState.isGlitching ? glitchState.offsetY * 0.5 : 0,
              clipPath: glitchState.clipPath,
              opacity: glitchState.isGlitching ? 0.6 : 0.15,
            }}
            transition={{ duration: 0.03 }}
            aria-hidden
          >
            {children}
          </motion.span>

          {/* Cyan channel offset */}
          <motion.span
            className="absolute inset-0 z-0"
            style={{
              color: "rgba(0, 255, 255, 0.4)",
              mixBlendMode: "screen",
            }}
            animate={{
              x: glitchState.isGlitching ? -glitchState.offsetX * 2 : -1,
              y: glitchState.isGlitching ? -glitchState.offsetY * 0.5 : 0,
              clipPath: glitchState.clipPath,
              opacity: glitchState.isGlitching ? 0.6 : 0.15,
            }}
            transition={{ duration: 0.03 }}
            aria-hidden
          >
            {children}
          </motion.span>

          {/* Violet ghost layer */}
          <motion.span
            className="absolute inset-0 z-0"
            style={{
              color: "rgba(168, 85, 247, 0.3)",
              mixBlendMode: "screen",
            }}
            animate={{
              x: glitchState.isGlitching ? glitchState.offsetX * -1.5 : 0,
              scaleX: glitchState.scaleX,
              opacity: glitchState.isGlitching ? 0.5 : 0,
            }}
            transition={{ duration: 0.03 }}
            aria-hidden
          >
            {children}
          </motion.span>
        </>
      )}
    </span>
  );
}
