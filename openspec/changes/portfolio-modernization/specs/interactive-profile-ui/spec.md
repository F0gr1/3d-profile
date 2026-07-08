## ADDED Requirements

### Requirement: Interactive 3D Profile Scene

The portfolio MUST preserve an interactive 3D profile scene that represents the developer identity and skills while keeping the scene visually polished enough for portfolio review.

#### Scenario: WebGL-capable visitor explores the scene

- Given a visitor opens the portfolio in a WebGL-capable browser
- When the page loads
- Then the hero area shows a React Three Fiber scene with a central profile avatar, skill markers, and decorative motion
- And the visitor can rotate and zoom the scene without losing access to the written profile content

### Requirement: Public Profile Content

The portfolio MUST display real public profile information for F0gr1/Ishigami Yuki and MUST NOT include placeholder contact links.

#### Scenario: Visitor reviews profile identity

- Given a visitor opens the portfolio
- When they read the hero and details sections
- Then they see the name Ishigami Yuki, handle F0gr1, full-stack web developer positioning, public skill focus, and public GitHub project links
- And they do not see placeholder email, username, LinkedIn, or fake contact data

### Requirement: Separated Content and Scene Rendering

The application MUST keep profile data separate from the 3D scene rendering code.

#### Scenario: Maintainer updates profile facts

- Given a maintainer needs to adjust public profile content
- When they edit the typed profile data module
- Then the semantic DOM content and scene labels can be updated without editing low-level mesh, light, or animation code
