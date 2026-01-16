"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SignalBackground, BackgroundSwitcher, type SignalVariant } from "@/components/shared/signal-background";
import { StaticNoise } from "@/components/shared/static-noise";
import { GlitchText } from "@/components/shared/glitch-text";
import { CoherenceMap, CoherenceMapSwitcher, type CoherenceVariant } from "@/components/shared/coherence-map";

type Phase = "intro" | "transition" | "chaos" | "explode" | "reveal" | "coherence" | "final";

// Shockwave effect component
function BreakthroughEffect({ trigger }: { trigger: boolean }) {
  return (
    <AnimatePresence>
      {trigger && (
        <>
          {/* Radial shockwave rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`ring-${i}`}
              className="fixed inset-0 flex items-center justify-center pointer-events-none z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="rounded-full border border-violet/60"
                initial={{ width: 0, height: 0, opacity: 0.8 }}
                animate={{
                  width: ["0vw", "200vw"],
                  height: ["0vw", "200vw"],
                  opacity: [0.6, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.15,
                  ease: "easeOut",
                }}
              />
            </motion.div>
          ))}
          {/* Central flash */}
          <motion.div
            className="fixed inset-0 bg-violet/20 pointer-events-none z-15"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

// Fade overlay for transition after explosion
function ExplosionFade({ trigger }: { trigger: boolean }) {
  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50"
          style={{ backgroundColor: "#0a0a12" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 2.0,
            delay: 0.2,
            ease: [0.4, 0, 0.2, 1], // Smooth ease-in-out
          }}
        />
      )}
    </AnimatePresence>
  );
}

function LandingSequence({ onPhaseChange, onBreakthrough, onEnterCoherence }: {
  onPhaseChange?: (phase: Phase) => void;
  onBreakthrough?: () => void;
  onEnterCoherence?: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [showBreakthrough, setShowBreakthrough] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);

  useEffect(() => {
    // Reset phase when component mounts (after variant switch)
    setPhase("intro");
    setShowBreakthrough(false);
    setShowExplosion(false);
    onPhaseChange?.("intro");

    // Timeline:
    // 0-5.5s: intro ("A fractured signal has broken through")
    // 5.5-11.5s: transition ("Your resonance is required to stabilise it")
    // 11.5-15.5s: chaos (background goes violent, 4 seconds)
    // 15.5-17s: explode (explosion effect, 1.5 seconds)
    // 17s+: reveal (video + button, no WebGL)
    const timers = [
      // Trigger breakthrough effect when "has broken through" appears
      setTimeout(() => {
        setShowBreakthrough(true);
        onBreakthrough?.();
        setTimeout(() => setShowBreakthrough(false), 2000);
      }, 1300),
      // Transition phase
      setTimeout(() => {
        setPhase("transition");
        onPhaseChange?.("transition");
      }, 5500),
      // Chaos phase - background goes violent
      setTimeout(() => {
        setPhase("chaos");
        onPhaseChange?.("chaos");
      }, 11500),
      // Explode phase - trigger explosion
      setTimeout(() => {
        setPhase("explode");
        onPhaseChange?.("explode");
        setShowExplosion(true);
      }, 15500),
      // Reveal phase - after explosion and fade settles
      setTimeout(() => {
        setPhase("reveal");
        onPhaseChange?.("reveal");
        setShowExplosion(false);
      }, 18500), // Extended to allow slower fade
    ];
    return () => timers.forEach(clearTimeout);
  }, [onPhaseChange, onBreakthrough]);

  return (
    <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 w-full min-h-screen">
      {/* Breakthrough shockwave effect */}
      <BreakthroughEffect trigger={showBreakthrough} />

      {/* Fade to void after explosion */}
      <ExplosionFade trigger={showExplosion} />

      <AnimatePresence mode="wait">
        {/* Phase 1: First phrase - centered, powerful */}
        {phase === "intro" && (
          <motion.div
            key="intro"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              // Screen shake when breakthrough happens
              x: showBreakthrough ? [0, -3, 3, -2, 2, 0] : 0,
              y: showBreakthrough ? [0, 2, -2, 1, -1, 0] : 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              filter: "blur(10px)"
            }}
            transition={{
              duration: 1.5,
              ease: [0.25, 0.1, 0.25, 1],
              x: { duration: 0.5, ease: "easeOut" },
              y: { duration: 0.5, ease: "easeOut" },
            }}
          >
            <h1 className="text-display-xl text-foreground uppercase max-w-5xl px-4 sm:px-6 animate-flicker">
              <motion.span
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                className="block animate-signal"
              >
                <GlitchText intensity="high">
                  A fractured signal
                </GlitchText>
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 40, filter: "blur(10px)", scale: 0.95 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  scale: 1,
                }}
                transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
                className="block"
              >
                {/* Brief text glow pulse on breakthrough */}
                <motion.span
                  className="inline-block"
                  animate={{
                    textShadow: showBreakthrough
                      ? [
                          "0 0 0px currentColor",
                          "0 0 30px rgba(168, 85, 247, 0.8), 0 0 60px rgba(168, 85, 247, 0.4)",
                          "0 0 10px currentColor",
                        ]
                      : "0 0 0px currentColor",
                  }}
                  transition={{ duration: 0.8 }}
                >
                  <GlitchText intensity="high">
                    has broken through
                  </GlitchText>
                </motion.span>
              </motion.span>
            </h1>
          </motion.div>
        )}

        {/* Phase 2: Second phrase - same style as first */}
        {phase === "transition" && (
          <motion.div
            key="transition"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 0.95,
              filter: "blur(10px)"
            }}
            transition={{
              duration: 1.5,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            <h2 className="text-display-xl text-foreground uppercase max-w-5xl px-4 sm:px-6 animate-flicker">
              <motion.span
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                className="block animate-signal"
              >
                <GlitchText intensity="high">
                  Your resonance is required
                </GlitchText>
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
                className="block text-gold text-glow"
              >
                <GlitchText intensity="high">
                  to stabilise it
                </GlitchText>
              </motion.span>
            </h2>
          </motion.div>
        )}

        {/* Phase 3: Full reveal */}
        {phase === "reveal" && (
          <motion.div
            key="reveal"
            className="flex flex-col items-center justify-center w-full max-w-4xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            {/* Video player */}
            <motion.div
              className="w-full max-w-2xl mb-8 sm:mb-14"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 1.8,
                delay: 0.5,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              <div className="rounded-2xl overflow-hidden relative">
                {/* Force light color scheme to override browser dark mode extensions */}
                <div
                  className="aspect-video relative flex items-center justify-center group cursor-pointer"
                  style={{
                    backgroundColor: "#ffffff",
                    colorScheme: "light",
                    filter: "none",
                  }}
                  data-theme="light"
                >
                  {/* Play button */}
                  <motion.div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      border: "2px solid rgba(0, 0, 0, 0.2)",
                      backgroundColor: "transparent",
                      filter: "none",
                    }}
                    whileHover={{
                      scale: 1.08,
                      borderColor: "rgba(168, 85, 247, 0.6)",
                      backgroundColor: "rgba(168, 85, 247, 0.05)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className="ml-1"
                      style={{
                        width: 0,
                        height: 0,
                        borderTop: "12px solid transparent",
                        borderBottom: "12px solid transparent",
                        borderLeft: "20px solid rgba(0, 0, 0, 0.3)",
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }}
              className="mb-6 sm:mb-10"
            >
              <motion.div
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 50px rgba(245, 158, 11, 0.4)"
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg"
              >
                <Button
                  size="lg"
                  onClick={onEnterCoherence}
                  className="glow-violet hover:glow-gold transition-all duration-700 font-display tracking-[0.1em] sm:tracking-[0.15em] text-base sm:text-lg md:text-xl px-6 py-4 sm:px-10 sm:py-6 md:px-14 md:py-9 h-auto uppercase border border-violet/20"
                >
                  <GlitchText intensity="medium" active={true}>
                    Stabilise the Signal
                  </GlitchText>
                </Button>
              </motion.div>
            </motion.div>

            {/* Supporting text */}
            <motion.p
              className="text-body text-muted-foreground/50 max-w-lg leading-relaxed px-2 sm:px-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 2.2, ease: "easeOut" }}
            >
              <GlitchText intensity="medium">
                The coherence requires your support—and that of others walking the path—to hold.
              </GlitchText>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// Background intensity based on phase - dimmed during text, bright on chaos, off on reveal
const PHASE_INTENSITY: Record<Phase, number> = {
  intro: 0.35,
  transition: 0.35,
  chaos: 1.0,
  explode: 1.0,
  reveal: 0, // No WebGL background during reveal
  coherence: 0, // No WebGL during coherence - using CoherenceMap instead
  final: 0, // No WebGL during final
};

export default function LandingPage() {
  const [variant, setVariant] = useState<SignalVariant>("burst");
  const [coherenceVariant, setCoherenceVariant] = useState<CoherenceVariant>("geometry");
  const [sequenceKey, setSequenceKey] = useState(0);
  const [coherenceKey, setCoherenceKey] = useState(0);
  const [phase, setPhase] = useState<Phase>("intro");
  const [breakthroughPulse, setBreakthroughPulse] = useState(false);
  const [chaosLevel, setChaosLevel] = useState(0);
  const [explodeScale, setExplodeScale] = useState(1);

  // Animate chaos level during chaos phase
  useEffect(() => {
    if (phase === "chaos") {
      // Ramp up chaos over 4 seconds
      const startTime = Date.now();
      const duration = 4000;
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-in curve for escalating intensity
        const easedProgress = progress * progress * progress;
        setChaosLevel(easedProgress);
      }, 16);
      return () => clearInterval(interval);
    } else if (phase === "explode") {
      // Keep chaos at max during explosion
      setChaosLevel(1);
    } else if (phase === "reveal") {
      setChaosLevel(0);
    } else {
      setChaosLevel(0);
    }
  }, [phase]);

  // Animate explosion scale - the actual WebGL bursts outward
  useEffect(() => {
    if (phase === "explode") {
      // Trigger the scale explosion
      setExplodeScale(12); // Scale up 12x - signal bursts toward viewer
    } else if (phase === "reveal") {
      setExplodeScale(1);
    } else {
      setExplodeScale(1);
    }
  }, [phase]);

  const handleSwitch = useCallback((newVariant: SignalVariant) => {
    if (newVariant !== variant) {
      setVariant(newVariant);
      setPhase("intro"); // Reset phase immediately
      setBreakthroughPulse(false);
      setChaosLevel(0);
      setExplodeScale(1);
      // Increment key to force remount and restart sequence
      setSequenceKey((k) => k + 1);
    }
  }, [variant]);

  const handlePhaseChange = useCallback((newPhase: Phase) => {
    setPhase(newPhase);
  }, []);

  const handleBreakthrough = useCallback(() => {
    // Brief background intensity pulse
    setBreakthroughPulse(true);
    setTimeout(() => setBreakthroughPulse(false), 800);
  }, []);

  const handleEnterCoherence = useCallback(() => {
    setPhase("coherence");
  }, []);

  const handleCoherenceSwitch = useCallback((newVariant: CoherenceVariant) => {
    if (newVariant !== coherenceVariant) {
      setCoherenceVariant(newVariant);
      // Reset the coherence map when switching variants
      setCoherenceKey((k) => k + 1);
    }
  }, [coherenceVariant]);

  const handleStabilized = useCallback(() => {
    // Transition to final phase after coherence is achieved
    setPhase("final");
  }, []);

  // Calculate effective intensity - pulse briefly brightens during breakthrough
  const baseIntensity = PHASE_INTENSITY[phase];
  const effectiveIntensity = breakthroughPulse
    ? Math.min(baseIntensity + 0.4, 0.75)
    : baseIntensity;

  // Determine which switcher to show
  const showSignalSwitcher = ["intro", "transition", "chaos", "explode"].includes(phase);
  const showCoherenceSwitcher = phase === "coherence";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden scan-lines">
      {/* Background Switcher Tabs - only during signal phases */}
      {showSignalSwitcher && (
        <BackgroundSwitcher currentVariant={variant} onSwitch={handleSwitch} />
      )}

      {/* Coherence Map Switcher - only during coherence phase */}
      {showCoherenceSwitcher && (
        <CoherenceMapSwitcher currentVariant={coherenceVariant} onSwitch={handleCoherenceSwitch} />
      )}

      {/* WebGL Background - Signal Animation with dynamic intensity */}
      <SignalBackground
        variant={variant}
        intensity={effectiveIntensity}
        chaosLevel={chaosLevel}
        explodeScale={explodeScale}
        key={`bg-${variant}`}
      />

      {/* Static noise overlay - also dims with background */}
      <div
        className="transition-opacity duration-300 ease-in-out"
        style={{ opacity: effectiveIntensity }}
      >
        <StaticNoise opacity={0.25} intensity="high" />
      </div>

      {/* Solid void background for reveal/coherence/final phases */}
      {["reveal", "coherence", "final"].includes(phase) && (
        <div className="fixed inset-0 bg-[#0a0a12] -z-10" />
      )}

      {/* Overlay gradient for depth */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(10,10,18,0.4) 100%)"
        }}
      />

      {/* Landing sequence - only show during intro/transition/chaos/explode/reveal */}
      {["intro", "transition", "chaos", "explode", "reveal"].includes(phase) && (
        <LandingSequence
          key={`sequence-${sequenceKey}`}
          onPhaseChange={handlePhaseChange}
          onBreakthrough={handleBreakthrough}
          onEnterCoherence={handleEnterCoherence}
        />
      )}

      {/* Coherence Map Phase */}
      {phase === "coherence" && (
        <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-12 sm:py-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full"
          >
            {/* Title */}
            <motion.h2
              className="text-display-lg text-foreground text-center mb-6 sm:mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlitchText intensity="low">
                Coherence Map
              </GlitchText>
            </motion.h2>

            {/* Coherence Map Visualization */}
            <CoherenceMap
              key={`coherence-${coherenceKey}`}
              variant={coherenceVariant}
              onStabilized={handleStabilized}
            />
          </motion.div>
        </main>
      )}

      {/* Final Phase - After Coherence Stabilized */}
      {phase === "final" && (
        <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6">
          <motion.div
            className="flex flex-col items-center justify-center w-full max-w-4xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            {/* Success Message */}
            <motion.h2
              className="text-display-lg text-gold text-glow text-center mb-4 sm:mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <GlitchText intensity="low">
                The Signal is Stabilised
              </GlitchText>
            </motion.h2>

            <motion.p
              className="text-body text-muted-foreground text-center mb-8 sm:mb-12 max-w-xl px-2 sm:px-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <GlitchText intensity="low">
                Through collective resonance, the transmission can now continue.
              </GlitchText>
            </motion.p>

            {/* Video player placeholder */}
            <motion.div
              className="w-full max-w-2xl mb-8 sm:mb-14"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
              <div className="rounded-2xl overflow-hidden relative">
                <div
                  className="aspect-video relative flex items-center justify-center group cursor-pointer"
                  style={{
                    backgroundColor: "#ffffff",
                    colorScheme: "light",
                    filter: "none",
                  }}
                  data-theme="light"
                >
                  {/* Play button */}
                  <motion.div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      border: "2px solid rgba(0, 0, 0, 0.2)",
                      backgroundColor: "transparent",
                      filter: "none",
                    }}
                    whileHover={{
                      scale: 1.08,
                      borderColor: "rgba(168, 85, 247, 0.6)",
                      backgroundColor: "rgba(168, 85, 247, 0.05)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className="ml-1"
                      style={{
                        width: 0,
                        height: 0,
                        borderTop: "12px solid transparent",
                        borderBottom: "12px solid transparent",
                        borderLeft: "20px solid rgba(0, 0, 0, 0.3)",
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 1 }}
            >
              <motion.div
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 50px rgba(245, 158, 11, 0.4)"
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg"
              >
                <Button
                  size="lg"
                  className="glow-gold hover:glow-violet transition-all duration-700 font-display tracking-[0.1em] sm:tracking-[0.15em] text-base sm:text-lg md:text-xl px-6 py-4 sm:px-10 sm:py-6 md:px-14 md:py-9 h-auto uppercase border border-gold/20"
                >
                  <GlitchText intensity="low">
                    Continue the Journey
                  </GlitchText>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </main>
      )}

      {/* Bottom ambient line */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-px z-20"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.3), transparent)"
        }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.5, delay: 12 }}
      />
    </div>
  );
}
