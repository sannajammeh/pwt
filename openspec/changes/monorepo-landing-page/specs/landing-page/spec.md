## ADDED Requirements

### Requirement: Dark theme design
The landing page SHALL use a dark color scheme matching statecharts.sh aesthetic.

#### Scenario: Page has dark background
- **WHEN** viewing the landing page
- **THEN** the background is dark (near-black) with light text

#### Scenario: Code blocks have syntax highlighting
- **WHEN** viewing code examples on the page
- **THEN** they display with syntax highlighting on a dark background

### Requirement: Hero section
The landing page SHALL have a hero section introducing PWT.

#### Scenario: Hero displays product name and tagline
- **WHEN** viewing the hero section
- **THEN** it shows "PWT" prominently with a brief description of what it does

#### Scenario: Hero shows key features
- **WHEN** viewing the hero section
- **THEN** it displays feature badges (e.g., "Git Worktrees", "Bun-powered", "Zero Config")

#### Scenario: Hero shows install command
- **WHEN** viewing the hero section
- **THEN** it displays installation command with copy functionality

### Requirement: Feature highlights section
The landing page SHALL explain PWT's key features.

#### Scenario: Features are listed with descriptions
- **WHEN** viewing the features section
- **THEN** each core feature (new, open, close, ls) has a title and brief description

### Requirement: Code example section
The landing page SHALL show usage examples with terminal output.

#### Scenario: Example shows typical workflow
- **WHEN** viewing code examples
- **THEN** they demonstrate creating and switching between worktrees

### Requirement: GitHub link
The landing page SHALL link to the project's GitHub repository.

#### Scenario: GitHub link is visible
- **WHEN** viewing the page header or hero
- **THEN** a GitHub link is displayed with the repository URL

### Requirement: FAQ section
The landing page SHALL have an FAQ section with expandable questions.

#### Scenario: FAQs are collapsible
- **WHEN** clicking an FAQ question
- **THEN** the answer expands/collapses

#### Scenario: FAQs cover common questions
- **WHEN** viewing the FAQ section
- **THEN** it includes questions about what worktrees are, requirements, and comparison to alternatives

### Requirement: Responsive layout
The landing page SHALL be readable on mobile devices.

#### Scenario: Page adapts to mobile viewport
- **WHEN** viewing on a mobile device (< 768px width)
- **THEN** content reflows to single column and remains readable

### Requirement: Static site output
The landing page SHALL build to static HTML for deployment.

#### Scenario: Build produces static files
- **WHEN** running `bun run build` in `apps/web`
- **THEN** it generates a `dist/` folder with static HTML, CSS, and JS
