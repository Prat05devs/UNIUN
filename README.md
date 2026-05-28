# Uniun Cinematic Homepage

A Next.js motion prototype for Uniun built as a scrollable product film: one note becomes a network, the network becomes knowledge, and knowledge becomes your AI.

## Run

```bash
yarn install
yarn dev
```

Then open `http://localhost:3000`.

This repo includes `.yarnrc` so Yarn Classic uses the npm registry with a longer network timeout. The project-level package manager pin is intentionally omitted to avoid Corepack timeouts.

## Stack

- Next.js app router
- TypeScript
- Tailwind CSS foundation with custom cinematic CSS
- GSAP ScrollTrigger for pinned scroll timelines
- Lenis for smooth scrolling
- Framer Motion for reveal animations
- Lucide React icons

## Key Files

- `src/components/UniunHome.tsx`: page structure and motion timelines
- `src/components/PhoneMockup.tsx`: reusable phone screenshot stack
- `src/app/globals.css`: visual system and responsive layout
- `public/assets/`: Uniun product screenshots
