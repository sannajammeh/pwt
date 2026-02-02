# PWT - Personal Worktree

A CLI tool for managing Git worktrees with an opinionated workflow.

## Installation

```bash
# Install globally with bun
bun install -g .

# Or link for development
bun link
```

### Shell Wrapper (Required for cd behavior)

**Automatic setup:**
```bash
pwt setup
```

**Manual setup** - Add to your `~/.zshrc` or `~/.bashrc`:

```zsh
pwt() {
  command pwtx "$@" | while IFS= read -r line; do
    if [[ $line == CD:* ]]; then
      cd "${line#CD:}"
    else
      echo "$line"
    fi
  done
}
```

See `SHELL_WRAPPER.md` for more details.

## Commands

### `pwt setup`

Install the shell wrapper for automatic directory switching.

```bash
pwt setup
```

### `pwt new [name] [branch]`

Create a new worktree from the current branch or a specified remote branch.

```bash
# Create from current branch
pwt new feature-x

# Create from origin/main
pwt new hotfix origin/main

# Interactive mode
pwt new
```

### `pwt close`

Close the current worktree with a summary of changes.

```bash
# Must be run from within a worktree
pwt close
```

### `pwt ls`

List all worktrees for the current repository.

```bash
pwt ls
```

### `pwt open [name]`

Switch to an existing worktree.

```bash
# Open by name
pwt open feature-x

# Interactive selection
pwt open
```

## Features

- **Centralized Storage**: All worktrees stored at `~/.worktrees/<repo>/<name>`
- **Auto ni Install**: Automatically runs `ni install` if `ni` is available
- **Interactive Prompts**: Guided prompts when arguments are omitted
- **Change Summaries**: Shows uncommitted changes and commit status on close
- **Nested Directory Support**: Works from any subdirectory of a repo

## Requirements

- Bun runtime
- Git
- Unix/macOS (Windows not supported)

## License

MIT
