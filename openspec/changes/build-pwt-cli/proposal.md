## Why

Managing Git worktrees manually is tedious and error-prone. Developers frequently need to spin up isolated environments for code reviews, experiments, or parallel feature work, but remembering worktree paths, tracking which branches are checked out where, and cleaning up stale worktrees creates friction. PWT (Produce Worktree) provides a streamlined, opinionated CLI that automates worktree creation with sensible defaults (centralized storage under `~/.worktrees/`), intelligent prompts, and seamless shell integration for automatic directory switching.

## What Changes

- Create a new Bun-based CLI tool named `pwt`
- Implement `pwt new` command with interactive prompts and branch selection
- Implement `pwt close` command to clean up worktrees with change summaries
- Implement `pwt ls` command to list active worktrees for current repository
- Implement `pwt open` command to switch to existing worktrees
- Add shell wrapper function for automatic cd behavior
- Add auto-detection of `ni` for automatic dependency installation
- Support nested directory execution (finds repo root from any subdirectory)

## Capabilities

### New Capabilities
- `cli-new`: Create new worktrees from current branch or specified remote branch with interactive prompts
- `cli-close`: Close worktrees with change summaries and cleanup
- `cli-list`: List all worktrees for the current repository
- `cli-open`: Open/switch to existing worktrees
- `shell-integration`: Shell wrapper for automatic directory switching
- `repo-discovery`: Repository root discovery from nested directories

### Modified Capabilities

## Impact

- New CLI tool built with Bun runtime
- Git worktree operations (create, remove, list)
- Shell configuration required for cd integration (.zshrc/.bashrc)
- Dependency on global `ni` command if available
- File system operations in `~/.worktrees/` directory
- Git repository introspection and branch management
