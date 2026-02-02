## 1. Monorepo Setup

- [x] 1.1 Create `packages/cli/` directory and move `src/` into it
- [x] 1.2 Move CLI's `package.json` and `tsconfig.json` to `packages/cli/`
- [x] 1.3 Update bin paths in `packages/cli/package.json` to reflect new location
- [x] 1.4 Create root `package.json` with workspaces config (`packages/*`, `apps/*`)
- [x] 1.5 Install Turborepo as dev dependency at root
- [x] 1.6 Create `turbo.json` with build/dev/lint pipelines
- [x] 1.7 Run `bun install` and verify workspace resolution
- [x] 1.8 Test CLI still works: `bun packages/cli/src/cli.ts --help`

## 2. Astro Project Init

- [x] 2.1 Create `apps/web/` directory
- [x] 2.2 Initialize Astro project in `apps/web/` with minimal template
- [x] 2.3 Configure `astro.config.mjs` for static output
- [x] 2.4 Add dev script to `apps/web/package.json`
- [x] 2.5 Verify `turbo dev` starts both CLI (if applicable) and web dev server

## 3. Landing Page Structure

- [x] 3.1 Create base layout with dark theme CSS variables
- [x] 3.2 Add global styles (typography, reset, color scheme)
- [x] 3.3 Create header component with site name and GitHub link
- [x] 3.4 Create footer component with copyright

## 4. Hero Section

- [x] 4.1 Create Hero component with product name "PWT"
- [x] 4.2 Add tagline describing git worktree management
- [x] 4.3 Add feature badges (Git Worktrees, Bun-powered, Zero Config)
- [x] 4.4 Add install command block with copy button
- [x] 4.5 Add GitHub repository link button

## 5. Content Sections

- [x] 5.1 Create "What is PWT?" section explaining worktrees
- [x] 5.2 Create Features section listing commands (new, open, close, ls)
- [x] 5.3 Create Code Example section with terminal-style code block
- [x] 5.4 Add syntax highlighting for code examples

## 6. FAQ Section

- [x] 6.1 Create expandable FAQ component (details/summary or JS)
- [x] 6.2 Add FAQ: "What are Git worktrees?"
- [x] 6.3 Add FAQ: "What are the requirements?"
- [x] 6.4 Add FAQ: "How is this different from git checkout?"

## 7. Responsive & Polish

- [x] 7.1 Add responsive breakpoints for mobile (< 768px)
- [x] 7.2 Test layout on mobile viewport
- [x] 7.3 Verify build produces static output: `bun run build`
- [x] 7.4 Final visual review against statecharts.sh reference
