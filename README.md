# F0gr1 Interactive 3D Profile

A Vite + React + TypeScript portfolio for **F0gr1 / Ishigami Yuki**. The 3D scene is progressive enhancement: the profile facts are always available as semantic HTML, including when WebGL is unavailable.

## Quick Start

Runtime requirements:

- Node.js `20.19+`
- npm `10+`

Install exactly from the lockfile and start development:

```bash
npm ci
npm run dev
```

Build and preview the production bundle:

```bash
npm run build
npm run preview
```

The app does not require environment variables. There is no database, API service, analytics integration, or other required runtime service.

## Docker

The image uses a multi-stage Node build and an unprivileged nginx runtime. The base images use fixed version tags and manifest digests.

```bash
docker compose up -d --build
curl -fsS http://localhost:8080/healthz
curl -I http://localhost:8080/
curl -I http://localhost:8080/any/client-side-route
docker compose down
```

The runtime serves the SPA on port `8080`, returns `ok` from `/healthz`, applies basic security headers, and falls back unknown paths to `index.html`. Compose intentionally contains only the web service.

## Tech Stack

- React `19.2.x` and React DOM `19.2.x`
- TypeScript `5.9.x` with strict checking
- Vite `8.1.x` and `@vitejs/plugin-react` `6.0.x`
- React Three Fiber `9.6.x`, Drei `10.7.x`, and Three.js `0.185.x`
- Vitest `4.x` and React Testing Library
- ESLint 9 flat config
- Docker multi-stage build with nginx Alpine runtime

## Runtime Behavior

### WebGL Fallback

`src/components/Profile3D.tsx` performs a WebGL capability check before mounting the Canvas. Canvas initialization errors are caught by an error boundary, and `webglcontextlost` switches the scene to the same visible static fallback. The profile content itself remains normal DOM headings, paragraphs, lists, and links.

The 3D layer is decorative and does not render the profile text. This intentionally avoids Drei's external-font loading path, so the app has no CDN font dependency. Skill names and profile identity remain available in HTML.

### Reduced Motion

The app observes `prefers-reduced-motion: reduce`. Reduced motion disables `OrbitControls` auto-rotation and mesh animation, and exposes the active mode in the status UI. CSS transitions and animations are also reduced.

### Public Data

`src/data/profile.ts` contains public GitHub-visible profile and project information only. Placeholder email, LinkedIn, and fake username links are not included.

## Validation

Run the complete local quality gate:

```bash
npm ci
npm run lint
npm run typecheck
npm run test:run
npm run build
npm audit
```

For the container path, run the Docker commands above and verify both `/healthz` and a non-root SPA deep-link response. A real browser is required to visually confirm active WebGL rendering, orbit controls, and context-loss behavior; jsdom tests cover the HTML and fallback paths.

## Project Structure

```text
src/
  data/profile.ts          Typed public profile data
  components/Profile3D.tsx Semantic page, fallback handling, and 3D scene
  App.tsx                  App shell
  App.css                  Responsive portfolio layout
  index.css                Global styles and reduced-motion CSS
  App.test.tsx             User-visible behavior tests
Dockerfile                 Multi-stage build and nginx runtime
docker-compose.yml         Local web container only
nginx.conf                 SPA fallback, health endpoint, and headers
openspec/                  Modernization proposal, design, tasks, and specs
```

Profile facts should be changed in `src/data/profile.ts` first. Avoid adding private or unverified contact information. The Three.js bundle is intentionally kept in the initial app for this small portfolio; a future performance pass could lazy-load the scene, but that is not required for correctness.

## Further Notes

See [`docs/IMPLEMENTATION_NOTES.md`](./docs/IMPLEMENTATION_NOTES.md) for the design rationale and extension notes. The OpenSpec change is under [`openspec/changes/portfolio-modernization/`](./openspec/changes/portfolio-modernization/).
