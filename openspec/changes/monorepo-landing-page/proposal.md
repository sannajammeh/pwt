## Why

PWT needs a professional landing page to showcase the CLI tool and provide documentation. The current flat structure needs reorganization for maintainability as we add a web presence alongside the CLI library.

## What Changes

- **BREAKING**: Move CLI source from `src/` to `packages/cli/src/`
- Add Turborepo as monorepo manager
- Create Astro-based landing page in `apps/web/`
- Landing page design matching statecharts.sh aesthetic (dark theme, code examples, minimal)

## Capabilities

### New Capabilities
- `monorepo-structure`: Turborepo configuration with `packages/cli` and `apps/web` workspaces
- `landing-page`: Astro site with dark theme, hero section, feature highlights, code examples, and FAQ

### Modified Capabilities
None - existing CLI functionality remains unchanged, only relocated.

## Impact

- **Package structure**: Root `package.json` becomes workspace root, CLI moves to `packages/cli`
- **Build system**: Turborepo orchestrates builds across packages
- **Dependencies**: New dev dependencies (turbo, astro)
- **Scripts**: Root scripts delegate to turbo (e.g., `turbo dev`, `turbo build`)
- **Bin paths**: CLI bin entry points need path updates after move
