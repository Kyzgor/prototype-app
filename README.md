# ARG Platform Prototype

A frontend-only rapid prototyping app for an ARG (Alternate Reality Game) platform launch flow.

## User Flow

```
Landing Page → ARG Section → Platform Opens → Path Selection
```

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the prototype.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page - entry point |
| `/arg` | ARG section - game experience |
| `/platform` | Platform - main content area |
| `/paths` | Path selection - user choices |

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui

## Adding Components

```bash
npx shadcn@latest add [component-name]
```

## Deployment

Deployed automatically to Vercel.
