## ADDED Requirements

### Requirement: Semantic DOM Profile

The portfolio MUST expose the profile as semantic HTML so the content remains readable without relying on WebGL canvas text.

#### Scenario: Assistive technology reads the page

- Given a screen reader or keyboard-only visitor opens the portfolio
- When they navigate the document structure
- Then they can reach the main heading, profile summary, build focus list, skill list, project links, and source note as normal DOM content
- And the canvas does not become the only way to understand the profile

### Requirement: WebGL Fallback

The portfolio MUST provide a visible fallback when WebGL is unavailable.

#### Scenario: Browser cannot create a WebGL context

- Given the browser cannot create a WebGL context
- When the profile page renders
- Then the scene panel displays a static fallback message
- And the same portfolio facts remain visible in semantic HTML

### Requirement: Reduced Motion Support

The portfolio MUST respect reduced-motion preferences where feasible.

#### Scenario: Visitor prefers reduced motion

- Given the visitor has enabled `prefers-reduced-motion: reduce`
- When the profile page renders
- Then automatic scene rotation and mesh animation are paused
- And the visible UI communicates that reduced-motion mode is active
