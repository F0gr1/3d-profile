## ADDED Requirements

### Requirement: Explicit Tooling Scripts

The project MUST provide explicit scripts for development, linting, type checking, test execution, and production build.

#### Scenario: Maintainer validates the project locally

- Given dependencies are installed with `npm ci`
- When the maintainer runs `npm run lint`, `npm run typecheck`, `npm run test:run`, `npm run build`, and `npm audit`
- Then each command executes through the configured Vite/Vitest/TypeScript/ESLint toolchain

### Requirement: Portfolio Content Tests

The test suite MUST verify visible profile content and fallback behavior.

#### Scenario: Tests run in jsdom

- Given the test environment does not provide a real WebGL context
- When the test suite renders the app
- Then tests verify public profile content, removal of placeholder contacts, WebGL fallback messaging, and reduced-motion status behavior

### Requirement: Documentation for Handoff

The README MUST explain setup, architecture, implementation notes, and quality gates in a learning-focused way for an engineer with around three years of experience.

#### Scenario: New maintainer reads the README

- Given a new maintainer opens the repository
- When they read the README
- Then they understand how to install, run, validate, and safely extend the interactive 3D profile
