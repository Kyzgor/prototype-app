/**
 * ==========================================================================
 * DESIGN TOKENS REFERENCE
 * ==========================================================================
 *
 * This file documents the mystical/esoteric design system for the ARG platform.
 * The actual CSS variables are defined in globals.css.
 * This file serves as a reference and for any programmatic color needs.
 *
 * Color Philosophy:
 * - Deep void backgrounds (NOT pure black - causes eye strain)
 * - Ethereal violet/purple as primary accent (mystical, otherworldly)
 * - Luminous gold/amber as secondary accent (alchemical, precious)
 * - Celestial cyan for highlights (ethereal, cosmic)
 * - Soft off-white text (easier on eyes than pure white)
 */

export const colors = {
  // Core mystical palette
  mystical: {
    void: "oklch(0.08 0.02 280)", // Deepest darkness - use sparingly
    abyss: "oklch(0.11 0.025 280)", // Main background
    violet: "oklch(0.65 0.22 290)", // Primary action color
    gold: "oklch(0.75 0.14 75)", // Accent highlights
    ethereal: "oklch(0.70 0.15 220)", // Celestial cyan
  },

  // Semantic colors (mapped to CSS variables)
  semantic: {
    background: "var(--background)",
    foreground: "var(--foreground)",
    primary: "var(--primary)",
    secondary: "var(--secondary)",
    accent: "var(--accent)",
    muted: "var(--muted)",
    destructive: "var(--destructive)",
    border: "var(--border)",
    ring: "var(--ring)",
  },

  // Chart/data visualization palette
  chart: {
    violet: "oklch(0.65 0.22 290)",
    gold: "oklch(0.75 0.14 75)",
    cyan: "oklch(0.70 0.15 220)",
    rose: "oklch(0.65 0.18 350)",
    emerald: "oklch(0.60 0.15 160)",
  },
} as const;

/**
 * Elevation levels for dark mode
 * In dark themes, higher elevation = lighter surface (opposite of light mode)
 */
export const elevation = {
  base: "oklch(0.11 0.025 280)", // Level 0 - main background
  raised: "oklch(0.15 0.03 280)", // Level 1 - cards
  overlay: "oklch(0.17 0.035 280)", // Level 2 - popovers, modals
  floating: "oklch(0.20 0.04 280)", // Level 3 - dropdowns, tooltips
} as const;

/**
 * Typography opacity levels (Google Material Design recommendations)
 * Use these for text hierarchy in dark mode
 */
export const textOpacity = {
  highEmphasis: 0.87, // Primary text, headings
  mediumEmphasis: 0.6, // Secondary text, descriptions
  disabled: 0.38, // Disabled state
} as const;

/**
 * Glow effects for dark mode (use instead of shadows)
 */
export const glows = {
  violet: "0 0 20px oklch(0.65 0.22 290 / 30%), 0 0 40px oklch(0.65 0.22 290 / 15%)",
  gold: "0 0 20px oklch(0.75 0.14 75 / 30%), 0 0 40px oklch(0.75 0.14 75 / 15%)",
  ethereal: "0 0 20px oklch(0.70 0.15 220 / 30%), 0 0 40px oklch(0.70 0.15 220 / 15%)",
} as const;

/**
 * Spacing scale (Tailwind default)
 */
export const spacing = {
  px: "1px",
  0: "0",
  0.5: "0.125rem",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
} as const;

/**
 * Border radius scale
 */
export const radius = {
  sm: "calc(0.625rem - 4px)",
  md: "calc(0.625rem - 2px)",
  lg: "0.625rem",
  xl: "calc(0.625rem + 4px)",
  "2xl": "calc(0.625rem + 8px)",
  full: "9999px",
} as const;
