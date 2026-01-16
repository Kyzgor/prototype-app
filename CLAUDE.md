# ARG Platform Prototype

## Project Overview

This is a **frontend-only rapid prototyping app** for an ARG (Alternate Reality Game) platform launch flow. The purpose is to test UI/UX, user flows, and design concepts without any backend integration.

**Important**: This is NOT a production app. It's a prototyping environment for rapid iteration.

---

## User Journey Flow

```
Landing Page → ARG Section → Platform Opens → Path Selection
     /            /arg          /platform         /paths
```

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16+ | React framework with App Router |
| TypeScript | Type-safe development |
| Tailwind CSS v4 | Utility-first styling |
| shadcn/ui | Pre-built accessible components |
| Vercel | Hosting (free plan) |

**No Backend** - All data is mocked locally in `src/data/mock.ts`.

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (dark mode enabled)
│   ├── globals.css         # Design system & theme tokens
│   ├── page.tsx            # Landing page (/)
│   ├── arg/page.tsx        # ARG section (/arg)
│   ├── platform/page.tsx   # Platform (/platform)
│   └── paths/page.tsx      # Path selection (/paths)
│
├── components/
│   ├── ui/                 # shadcn/ui components (auto-generated)
│   ├── layouts/            # Layout wrappers (PageWrapper, etc.)
│   └── shared/             # Shared/reusable custom components
│
├── lib/
│   ├── utils.ts            # cn() helper for class merging
│   └── design-tokens.ts    # Design system reference
│
├── data/
│   └── mock.ts             # Mock data for prototyping
│
└── hooks/                  # Custom React hooks
```

---

## Design System

### Theme: Mystical/Esoteric Dark Mode

The design system uses a dark theme inspired by occult aesthetics, celestial imagery, and mystical symbolism.

### Color Tokens

| Token | CSS Variable | Tailwind Class | Use Case |
|-------|--------------|----------------|----------|
| Void | `--void` | `bg-void` | Deepest darkness, dramatic sections |
| Abyss | `--abyss` | `bg-abyss` | Main backgrounds |
| Violet | `--violet` | `bg-violet`, `text-violet` | Primary actions, emphasis |
| Gold | `--gold` | `bg-gold`, `text-gold` | Accents, highlights, special elements |
| Ethereal | `--ethereal` | `bg-ethereal`, `text-ethereal` | Secondary highlights, links |

### Semantic Tokens (shadcn/ui Compatible)

| Token | Tailwind Class | Maps To |
|-------|----------------|---------|
| Background | `bg-background` | Deep navy void |
| Foreground | `text-foreground` | Soft off-white |
| Primary | `bg-primary` | Luminous violet |
| Secondary | `bg-secondary` | Muted violet |
| Accent | `bg-accent`, `text-accent` | Gold |
| Muted | `bg-muted`, `text-muted-foreground` | Dimmed elements |
| Card | `bg-card` | Elevated surface |
| Border | `border-border` | Subtle violet-tinted |
| Destructive | `bg-destructive` | Ethereal crimson |

---

## shadcn/ui + Design Tokens Integration

### Adding Components

```bash
# Add components as needed
npx shadcn@latest add button card dialog input separator badge

# Components install to src/components/ui/
```

### Styling Patterns

shadcn/ui components automatically use our theme tokens. Here's how to enhance them:

#### Basic Usage (Auto-Themed)
```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// These automatically use --primary, --card, etc.
<Button>Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outlined</Button>
<Card>Content here</Card>
```

#### Adding Mystical Effects
```tsx
// Add glow to buttons for emphasis
<Button className="glow-violet">Mystical CTA</Button>
<Button className="glow-gold">Golden Action</Button>

// Glass effect cards
<Card className="glass">
  <CardContent>Ethereal content</CardContent>
</Card>

// Gradient backgrounds
<div className="bg-gradient-mystic p-8">
  <Card>Card on gradient</Card>
</div>
```

#### Custom Styled Components
```tsx
// Mystical heading with glow
<h1 className="text-4xl font-bold text-foreground text-glow">
  Title
</h1>

// Gold accent text
<p className="text-gold">Important highlight</p>

// Ethereal link style
<span className="text-ethereal hover:text-ethereal/80 cursor-pointer">
  Clickable text
</span>

// Violet emphasis
<span className="text-violet font-semibold">Emphasized</span>
```

#### Card Variants
```tsx
// Standard elevated card
<Card>...</Card>

// Glass morphism card
<Card className="glass">...</Card>

// Card with glow on hover
<Card className="hover:glow-violet transition-shadow duration-300">
  ...
</Card>

// Card with border accent
<Card className="border-violet/30">...</Card>
```

#### Button Combinations
```tsx
// Primary with glow
<Button className="glow-violet">Primary</Button>

// Ghost with gold text
<Button variant="ghost" className="text-gold hover:text-gold/80">
  Golden Ghost
</Button>

// Outline with ethereal
<Button variant="outline" className="border-ethereal text-ethereal">
  Ethereal Outline
</Button>

// Large mystical CTA
<Button size="lg" className="glow-violet text-lg px-8">
  Enter the Unknown
</Button>
```

### Available Utility Classes

| Class | Effect |
|-------|--------|
| `glow-violet` | Purple outer glow |
| `glow-gold` | Gold outer glow |
| `glow-ethereal` | Cyan outer glow |
| `text-glow` | Text shadow glow (uses current color) |
| `glass` | Frosted glass background with blur |
| `bg-gradient-mystic` | Subtle diagonal purple gradient |
| `bg-gradient-celestial` | Vertical void-to-navy gradient |

### Typography Scale

```tsx
// Headings
<h1 className="text-5xl font-bold tracking-tight">Hero</h1>
<h2 className="text-3xl font-semibold">Section</h2>
<h3 className="text-xl font-medium">Subsection</h3>

// Body
<p className="text-base text-foreground">Primary text</p>
<p className="text-sm text-muted-foreground">Secondary text</p>
<p className="text-xs text-muted-foreground/60">Tertiary/caption</p>

// Special
<p className="text-lg text-gold font-medium">Highlighted</p>
<p className="text-violet italic">Mystical emphasis</p>
```

### Spacing Guidelines

```tsx
// Page sections
<section className="py-16 md:py-24">...</section>

// Content gaps
<div className="space-y-8">...</div>  // Between sections
<div className="space-y-4">...</div>  // Between elements
<div className="space-y-2">...</div>  // Tight grouping

// Card padding
<CardContent className="p-6">...</CardContent>
```

---

## Creating New Components

### Pattern: Wrap shadcn/ui
```tsx
// src/components/shared/mystical-button.tsx
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MysticalButtonProps extends ButtonProps {
  glow?: "violet" | "gold" | "ethereal";
}

export function MysticalButton({
  glow = "violet",
  className,
  ...props
}: MysticalButtonProps) {
  return (
    <Button
      className={cn(
        glow === "violet" && "glow-violet",
        glow === "gold" && "glow-gold",
        glow === "ethereal" && "glow-ethereal",
        className
      )}
      {...props}
    />
  );
}
```

### Pattern: Composed Component
```tsx
// src/components/shared/mystical-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MysticalCardProps {
  title?: string;
  children: React.ReactNode;
  variant?: "default" | "glass" | "glow";
  className?: string;
}

export function MysticalCard({
  title,
  children,
  variant = "default",
  className
}: MysticalCardProps) {
  return (
    <Card className={cn(
      variant === "glass" && "glass",
      variant === "glow" && "hover:glow-violet transition-shadow",
      className
    )}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}
```

---

## GitHub + Vercel Deployment

### Initial Setup

1. **Create GitHub Repository**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/prototype-app.git
   git branch -M main
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js - click "Deploy"

3. **Share URL**
   - Vercel provides: `prototype-app.vercel.app`
   - Share with co-founder for testing

### Deployment Workflow

```bash
# Make changes, then:
git add .
git commit -m "Update design"
git push
# Auto-deploys in ~30-60 seconds
```

### Preview Branches

```bash
git checkout -b experiment/new-idea
git push -u origin experiment/new-idea
# Creates preview: prototype-app-git-experiment-new-idea.vercel.app
```

---

## Development Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build (verify before push)
npm run lint     # Check for issues
```

---

## Key Constraints

1. **NO backend** - All data in `src/data/mock.ts`
2. **NO API calls** - Pure frontend
3. **NO auth** - Keep it simple
4. **Dark mode only** - Mystical theme
5. **shadcn/ui first** - Use existing components before building custom

---

## Quick Reference

### Add Mock Data
```ts
// src/data/mock.ts
export const newMockData = [
  { id: "1", label: "Item" },
];
```

### Add New Page
```tsx
// src/app/new-route/page.tsx
export default function NewPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <h1 className="text-4xl font-bold">New Page</h1>
    </div>
  );
}
```

### Add shadcn Component
```bash
npx shadcn@latest add [component-name]
```

---

## Notes for AI Assistants

- **Frontend only** - Never suggest backend/API integrations
- **Use shadcn/ui** - Don't rebuild existing components
- **Apply theme tokens** - Use `glow-*`, `glass`, `bg-gradient-*` classes
- **Prefer semantic colors** - `bg-primary`, `text-accent` over raw values
- **Dark mode context** - Use glows not shadows, lighter = elevated
- **Keep prototyping fast** - Simple code over perfect abstractions
