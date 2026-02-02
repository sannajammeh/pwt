## ADDED Requirements

### Requirement: Turborepo workspace configuration
The project SHALL use Turborepo to manage a monorepo with workspaces defined in root `package.json`.

#### Scenario: Workspace packages are recognized
- **WHEN** running `bun install` at repository root
- **THEN** dependencies for all workspaces (`packages/*`, `apps/*`) are installed

#### Scenario: Turbo commands work from root
- **WHEN** running `turbo dev` from repository root
- **THEN** Turborepo starts dev servers for all packages with a `dev` script

### Requirement: CLI package location
The CLI source code SHALL reside in `packages/cli/` with its own `package.json`.

#### Scenario: CLI package has correct structure
- **WHEN** inspecting `packages/cli/`
- **THEN** it contains `src/`, `package.json`, and `tsconfig.json`

#### Scenario: CLI bin entry points work
- **WHEN** running `bun packages/cli/src/cli.ts`
- **THEN** the PWT CLI executes correctly

### Requirement: Web app location
The landing page SHALL reside in `apps/web/` as an Astro project.

#### Scenario: Web app has correct structure
- **WHEN** inspecting `apps/web/`
- **THEN** it contains `src/`, `package.json`, `astro.config.mjs`, and standard Astro directories

### Requirement: Root package.json is workspace root
The root `package.json` SHALL define workspaces and contain no application code.

#### Scenario: Root defines workspaces
- **WHEN** inspecting root `package.json`
- **THEN** it contains `"workspaces": ["packages/*", "apps/*"]`

#### Scenario: Root has turbo as dev dependency
- **WHEN** inspecting root `package.json`
- **THEN** it contains `turbo` in `devDependencies`
