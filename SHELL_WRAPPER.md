# PWT Shell Wrapper

The PWT CLI outputs `CD:<path>` lines to signal directory changes. Since a CLI process cannot change its parent shell's working directory, you need to install a shell wrapper function.

## Installation

Add one of the following functions to your shell configuration file (`~/.zshrc` for zsh or `~/.bashrc` for bash):

### Zsh Wrapper

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

### Bash Wrapper

```bash
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

## How It Works

1. The shell function runs `pwtx` (the actual CLI binary)
2. Output is piped and processed line-by-line
3. If a line starts with `CD:`, it extracts the path and executes `cd`
4. All other lines pass through to stdout
5. **Important**: stdin remains connected to the terminal, so interactive prompts work correctly

## Verification

After adding the wrapper and reloading your shell:

```bash
# Verify wrapper is active
type pwt

# Should show the function definition, not just the binary path

# Test it works
pwt new test-worktree
```

## Without the Wrapper

If you run `pwtx` directly without the wrapper:
- All commands will work
- Directory changes will show `CD:/path/to/worktree` in output
- You'll need to manually `cd` to that path
- Interactive prompts work normally

## Troubleshooting

**Command hangs or freezes:**
- Make sure you're using the pipeline wrapper above, not the old `output=$(command ...)` version
- The old version captured all stdout, breaking interactive prompts

**"pwtx: command not found":**
- Make sure PWT is installed globally: `bun install -g .`
- Check that `pwtx` is in your PATH: `which pwtx`

## Uninstall

Remove the function from your shell configuration file and reload:

```bash
# For zsh
source ~/.zshrc

# For bash
source ~/.bashrc
```
