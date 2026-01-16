"use client";

import { useEffect, useRef } from "react";

interface StaticNoiseProps {
  opacity?: number;
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export function StaticNoise({
  opacity = 0.15,
  className = "",
  intensity = "medium"
}: StaticNoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let lastTime = 0;
    const fps = 30;
    const interval = 1000 / fps;

    // Intensity settings
    const settings = {
      low: { noiseAlpha: 40, glitchChance: 0.05, scanLineCount: 3 },
      medium: { noiseAlpha: 80, glitchChance: 0.15, scanLineCount: 6 },
      high: { noiseAlpha: 120, glitchChance: 0.3, scanLineCount: 10 },
    };
    const { noiseAlpha, glitchChance, scanLineCount } = settings[intensity];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawNoise = (time: number) => {
      animationId = requestAnimationFrame(drawNoise);

      const delta = time - lastTime;
      if (delta < interval) return;
      lastTime = time - (delta % interval);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw base noise
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 255;
        data[i] = noise;
        data[i + 1] = noise;
        data[i + 2] = noise;
        // Random alpha creates flickering effect
        data[i + 3] = Math.random() < 0.3 ? Math.random() * noiseAlpha : 0;
      }
      ctx.putImageData(imageData, 0, 0);

      // Random horizontal glitch lines (fractured signal effect)
      if (Math.random() < glitchChance) {
        const numLines = Math.floor(Math.random() * scanLineCount) + 1;

        for (let i = 0; i < numLines; i++) {
          const y = Math.random() * canvas.height;
          const height = Math.random() * 8 + 2;
          const xOffset = (Math.random() - 0.5) * 20;

          // Draw glitch line
          ctx.save();
          ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '168, 85, 247' : '255, 255, 255'}, ${Math.random() * 0.5 + 0.2})`;
          ctx.fillRect(xOffset, y, canvas.width, height);

          // Sometimes add a color shift
          if (Math.random() > 0.5) {
            ctx.fillStyle = `rgba(255, 100, 100, ${Math.random() * 0.3})`;
            ctx.fillRect(xOffset + 3, y, canvas.width, height);
          }
          ctx.restore();
        }
      }

      // Occasional full-screen flash/flicker
      if (Math.random() < 0.02) {
        ctx.fillStyle = `rgba(168, 85, 247, ${Math.random() * 0.1})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw scan lines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillRect(0, y, canvas.width, 2);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    animationId = requestAnimationFrame(drawNoise);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-40 ${className}`}
      style={{ opacity }}
    />
  );
}
