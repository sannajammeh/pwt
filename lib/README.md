# PWT - Personal Worktree

A CLI for managing Git worktrees.

**Git Worktrees** · **Zero Config**

## Installation

```bash
# bun
bun install -g pwt-cli

# npm
npm install -g pwt-cli

# pnpm
pnpm add -g pwt-cli
```

## What is PWT?

Git worktrees let you check out multiple branches simultaneously in separate directories. Instead of stashing or committing work-in-progress to switch branches, each branch lives in its own folder.

PWT simplifies worktree management. Create, switch, and clean up worktrees with short commands instead of remembering long Git incantations.

## Commands

```bash
pwt new <branch>      # Create a new worktree
pwt open <branch>     # Switch to an existing worktree
pwt close             # Close the current worktree
pwt ls                # List all worktrees
```

## Setup

PWT requires a shell wrapper for automatic directory switching. Run the setup command to install it:

```bash
$ pwt setup
🔧 Shell wrapper setup for PWT

Install PWT wrapper in ~/.zshrc? [Y/n] Y
✓ Shell wrapper added to ~/.zshrc
  Run 'source ~/.zshrc' to activate

🎉 Setup complete!
```

The shell wrapper enables **automatic cd** into new worktrees and **automatic dependency installation** via [ni](https://github.com/antfu-collective/ni) (if installed).

### Manual Shell Wrapper

For manual installation or unsupported shells, add this function to your shell config (`~/.zshrc`):

```bash
# PWT (Personal Worktree) shell wrapper
pwt() {
  PWT_WRAPPER=1 command pwtx "$@" | while IFS= read -r line; do
    if [[ $line == CD:* ]]; then
      cd "${line#CD:}"
    else
      echo "$line"
    fi
  done
}
```

## Example Workflow

Work on multiple features simultaneously without stashing or committing incomplete work. Each worktree is a separate directory with its own branch checked out.

```bash
# Quick shorthand - auto-detects new vs open
$ pwt feature/auth
Creating worktree for feature/auth...
✓ Worktree created at ~/code/myproject--feature-auth

# Running again opens existing worktree
$ pwt feature/auth
✓ Now in ~/code/myproject--feature-auth

# List all worktrees
$ pwt ls
┌─────────────────┬────────────────────────────────┬────────┐
│ Branch          │ Path                           │ Status │
├─────────────────┼────────────────────────────────┼────────┤
│ main            │ ~/code/myproject               │ active │
│ feature/auth    │ ~/code/myproject--feature-auth │        │
└─────────────────┴────────────────────────────────┴────────┘

# Switch to another worktree
$ pwt open main
✓ Now in ~/code/myproject

# Clean up when done
$ pwt close
✓ Worktree removed
```

## FAQ

### What are Git worktrees?

Git worktrees allow you to have multiple working directories attached to the same repository, each checked out to a different branch. This means you can work on multiple branches simultaneously without stashing or committing incomplete work.

### What are the requirements?

PWT requires Git 2.5+ (for worktree support). It works on macOS, Linux, and Windows.

### How is this different from git checkout?

With git checkout, you can only have one branch active at a time. With worktrees, each branch lives in its own directory, so you can have multiple branches open in different terminal windows or editors simultaneously.

## License

MIT
