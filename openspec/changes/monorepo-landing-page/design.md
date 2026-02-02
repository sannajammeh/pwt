## Context

PWT is a CLI tool for managing Git worktrees. Currently structured as a flat Bun project with source in `src/`. Adding a marketing landing page requires reorganization to support multiple packages.

The reference design (statecharts.sh) uses a dark theme with minimal aesthetic, code-focused sections, and developer-oriented content.

## Goals / Non-Goals

**Goals:**
- Establish clean monorepo structure using Turborepo
- Create Astro landing page matching statecharts.sh aesthetic
- Preserve CLI functionality with zero breaking changes to user experience
- Enable independent development of CLI and web packages

**Non-Goals:**
- Documentation site (just a landing page for now)
- Blog or dynamic content
- User authentication or backend features
- Publishing CLI to npm (existing bun-based workflow unchanged)

## Decisions

### 1. Turborepo over alternatives

**Decision**: Use Turborepo for monorepo orchestration

**Alternatives considered**:
- Nx: More features but heavier, overkill for 2 packages
- pnpm workspaces alone: No build caching or task orchestration
- Lerna: Deprecated/less maintained

**Rationale**: Turborepo is lightweight, has excellent Bun support, provides build caching, and handles task dependencies well.

### 2. Directory structure

**Decision**: Use `packages/` for libraries, `apps/` for deployables

```
pwt/
├── apps/
│   └── web/          # Astro landing page
├── packages/
│   └── cli/          # PWT CLI (moved from src/)
├── turbo.json
└── package.json      # Workspace root
```

**Rationale**: Standard Turborepo convention. Separates deployable apps from reusable packages. Future-proofs for additional packages (e.g., `packages/core` if we extract shared logic).

### 3. Astro for landing page

**Decision**: Use Astro with static output

**Alternatives considered**:
- Next.js: SSR overkill for static landing page
- Plain HTML: No component reuse, harder to maintain
- Bun.serve with HTML imports: Good for apps, not ideal for static site deployment

**Rationale**: Astro excels at static content sites, has minimal JS by default, supports component islands if needed, and deploys easily to Vercel/Netlify.

### 4. Landing page design system

**Decision**: Custom CSS with CSS variables, no framework

**Alternatives considered**:
- Tailwind: Adds build complexity, overkill for single page
- Component library: External dependency for simple needs

**Rationale**: The statecharts.sh design is minimal enough that custom CSS is simpler. CSS variables for theming (dark mode colors). Keep it lightweight.

### 5. Package manager

**Decision**: Keep Bun as package manager with workspace support

**Rationale**: Already using Bun. Bun workspaces work with Turborepo. No need to switch to pnpm.

## Risks / Trade-offs

**[Breaking bin paths during migration]** → Create migration in single commit. Test CLI after move before pushing.

**[Turborepo learning curve]** → Minimal config needed for 2 packages. Basic `turbo.json` sufficient.

**[Astro version churn]** → Pin Astro version. Static site, so minimal breaking risk.

**[Design drift from reference]** → Use screenshot as reference, not pixel-perfect clone. Focus on aesthetic match (dark theme, typography, layout patterns).
