# Portfolio Modernization

## Summary

Modernize the interactive 3D profile from a CRA demo-style page into a portfolio-quality React/TypeScript application. The core idea remains an interactive 3D profile, but the page must also work as semantic HTML with trustworthy public profile content.

## Motivation

The previous implementation mixed profile data, Three.js scene rendering, inline styles, and placeholder contact links in one component. It also depended on CRA defaults and had a stale placeholder test. This made the project harder to evaluate as a real portfolio artifact.

## Goals

- Migrate the app to a Vite + React + TypeScript + Vitest toolchain.
- Separate F0gr1/Ishigami Yuki profile content from scene rendering.
- Present a polished 3D scene as progressive enhancement, not the only source of content.
- Add WebGL and reduced-motion fallback behavior.
- Document setup, architecture, implementation notes, and quality gates.

## Non-Goals

- Do not add private contact information or unverified claims.
- Do not add authentication, CMS, analytics, or deployment automation.
- Do not redesign this into a multi-page portfolio.
