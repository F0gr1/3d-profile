# Design

## Approach

The application uses semantic React DOM as the source of truth and treats React Three Fiber as a progressive enhancement. Profile facts live in a typed data module so the scene, overlay, tests, and documentation can share the same verified public content.

## Architecture

- `src/data/profile.ts` owns public profile content and typed data contracts.
- `src/components/Profile3D.tsx` owns rendering composition, WebGL detection, reduced-motion detection, semantic sections, and the 3D scene.
- `src/App.css` owns the portfolio visual system and responsive layout.
- Vite owns development/build, Vitest owns component tests, and ESLint/TypeScript own static quality gates.

## Accessibility and Fallbacks

The canvas is marked as decorative because the DOM contains the profile content in headings, paragraphs, lists, and links. When WebGL is unavailable, the scene area renders a readable static fallback. When `prefers-reduced-motion` is enabled, automatic scene movement is disabled and the UI exposes a visible reduced-motion status.

## Data Policy

Profile content is limited to public GitHub-visible information: F0gr1/Ishigami Yuki, full-stack web developer positioning, publicly listed build focus, public tech stack, and public GitHub project links. Placeholder email, LinkedIn, and fake username links are removed.

## Tradeoffs

The migration avoids a larger routing or design-system setup so the project remains feasible in one pass. The current fallback checks runtime WebGL availability but does not attempt to recover from a WebGL context lost after scene initialization.
