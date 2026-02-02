## Context

PWT is a CLI tool for managing Git worktrees with an opinionated workflow. Worktrees allow checking out multiple branches simultaneously in separate directories, but Git's native worktree commands are low-level and require manual path management. PWT automates this with sensible defaults: centralized storage under `~/.worktrees/`, interactive prompts, and automatic directory switching.

Key constraints:
- CLI processes cannot change parent shell's working directory
- Worktrees must be tracked for `ls` and `open` commands to function
- Commands must work from any nested subdirectory within a repo or worktree

## Goals / Non-Goals

**Goals:**
- Streamlined worktree creation with single command
- Automatic dependency installation when `ni` is available
- Shell integration for transparent directory switching
- Centralized worktree storage for easy discovery
- Support for creating worktrees from current branch or any remote branch
- Clean worktree teardown with change summaries

**Non-Goals:**
- Windows support (Unix/macOS only)
- GUI or TUI interface (pure CLI)
- Custom worktree storage locations (strictly `~/.worktrees/`)
- Integration with package managers other than `ni`
- Worktree modification (renaming, moving)

## Decisions

### 1. Bun Runtime Over Pure Shell
**Decision**: Implement core logic in TypeScript/Bun rather than shell scripts.

**Rationale**:
- Better error handling and type safety
- Access to rich ecosystem (@types/node, cli libraries)
- Easier testing and maintenance
- Consistent behavior across zsh/bash

**Alternatives considered**:
- Pure zsh/bash: Faster startup, but harder to maintain complex logic
- Node.js: Heavier dependency than Bun for a CLI tool

### 2. Hybrid Auto-cd Approach
**Decision**: Use Bun CLI for logic + shell wrapper function for cd behavior.

**Mechanism**:
- CLI outputs `CD:<path>` line when directory change needed
- Shell wrapper intercepts output, extracts path, executes `cd`
- All other output passes through unchanged

**Rationale**:
- Only way to change parent shell directory is via shell built-in
- Clean separation: Bun handles logic, shell handles environment

**Example wrapper** (user adds to `.zshrc`):
```zsh
pwt() {
  local output
  output=$(command pwt "$@")
  if [[ $output == CD:* ]]; then
    cd "${output#CD:}"
  else
    echo "$output"
  fi
}
```

### 3. Worktree Index Files
**Decision**: Maintain an index file per repository at `~/.worktrees/<repo>.index.txt`.

**Format**:
```
worktree-name|path|branch|created-at
feature-x|/Users/.../.worktrees/myrepo/feature-x|feature-branch|2025-01-15T10:30:00Z
```

**Rationale**:
- Git worktree list doesn't track which repo a worktree belongs to
- Index enables fast `pwt ls` without scanning filesystem
- Allows tracking metadata (creation time) not stored by Git
- Simple text format for easy debugging

**Alternative considered**:
- Parse `git worktree list` output: Too slow, doesn't map worktrees to source repo

### 4. Repository Root Discovery
**Decision**: Walk up directory tree to find `.git` directory or `.git` file (for worktrees).

**Algorithm**:
1. Start at current working directory
2. Check for `.git` (directory = repo root, file = worktree)
3. If `.git` is a file, parse `gitdir:` path to find original repo
4. If not found, move to parent directory
5. Fail if reaching filesystem root without finding `.git`

**Rationale**:
- Works from any nested subdirectory
- Handles both regular repos and worktrees
- No dependencies on Git environment variables

### 5. Centralized Worktree Storage
**Decision**: All worktrees stored at `~/.worktrees/<repo-name>/<worktree-name>`.

**Rationale**:
- Predictable paths enable easy navigation and cleanup
- Separates worktrees from source code
- Enables global `pwt ls` view across all projects

**Trade-off**:
- Requires `~/.worktrees/` to exist and be writable
- Worktrees not visible in typical project directory listings

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Shell wrapper not installed | Clear error message when `CD:` output seen without wrapper; provide install instructions in README |
| Index file out of sync with reality | Regenerate index on `pwt ls` by scanning `~/.worktrees/<repo>/` directory |
| Worktree name collisions | Append number suffix (e.g., `feature-2`) if name exists |
| ni detection false positive | Check `which ni` and verify executable exists, don't rely on exit code alone |
| Permission denied on ~/.worktrees | Create directory on first run with `mkdir -p`, provide clear error if creation fails |

## Migration Plan

**Installation**:
1. `bun install -g pwt` to install CLI binary
2. Add shell wrapper to `.zshrc` or `.bashrc` (manual step, documented)
3. Verify with `pwt --version`

**Uninstallation**:
1. `bun uninstall -g pwt`
2. Remove shell wrapper from rc file
3. Optionally remove `~/.worktrees/` directory

**Rollback**:
- Native Git worktrees remain functional if PWT is removed
- No database or complex state to migrate
