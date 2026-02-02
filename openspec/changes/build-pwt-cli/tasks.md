## 1. Project Setup

- [x] 1.1 Initialize Bun project with `bun init` in pwt directory
- [x] 1.2 Create `package.json` with CLI entry point (`bin` field)
- [x] 1.3 Add TypeScript configuration (`tsconfig.json`)
- [x] 1.4 Add CLI argument parser dependency (`commander` or `cac`)
- [x] 1.5 Add prompt library for interactive mode (`@inquirer/prompts`)
- [x] 1.6 Add table formatter for `ls` output (`cli-table3` or similar)
- [x] 1.7 Create basic project structure (src/, src/commands/, src/utils/)

## 2. Core Infrastructure

- [x] 2.1 Implement `findRepoRoot(cwd: string)` - walk up tree to find `.git`
- [x] 2.2 Implement `getOriginalRepo(worktreeGitFile: string)` - parse `gitdir:` path
- [x] 2.3 Implement `getRepoName(repoRoot: string)` - extract repo name from path
- [x] 2.4 Implement `execGit(args: string[], cwd?: string)` - typed git command wrapper
- [x] 2.5 Implement `getCurrentBranch(repoRoot: string)` - get active branch name
- [x] 2.6 Implement `path utilities` - expand `~` to home directory
- [x] 2.7 Create error handling utilities with user-friendly messages

## 3. Worktree Index Management

- [x] 3.1 Define `WorktreeEntry` interface (name, path, branch, createdAt)
- [x] 3.2 Implement `getIndexPath(repoName: string)` - `~/.worktrees/<repo>.index.txt`
- [x] 3.3 Implement `readIndex(repoName: string)` - parse index file to entries
- [x] 3.4 Implement `writeIndex(repoName: string, entries: WorktreeEntry[])` - serialize to file
- [x] 3.5 Implement `addToIndex(repoName: string, entry: WorktreeEntry)` - append entry
- [x] 3.6 Implement `removeFromIndex(repoName: string, worktreeName: string)` - filter entry
- [x] 3.7 Implement `regenerateIndex(repoName: string)` - scan `~/.worktrees/<repo>/` directory

## 4. CLI Command: pwt new

- [x] 4.1 Parse command arguments (worktree-name, branch, -b flag)
- [x] 4.2 Implement interactive prompt for worktree name when not provided
- [x] 4.3 Determine source branch (current branch or specified remote branch)
- [x] 4.4 Calculate worktree path `~/.worktrees/<repo>/<name>`
- [x] 4.5 Handle worktree name collisions with numeric suffix
- [x] 4.6 Execute `git worktree add <path> <branch>`
- [x] 4.7 Detect `ni` command availability (`which ni`)
- [x] 4.8 Execute `ni install` in new worktree if ni available
- [x] 4.9 Add entry to worktree index
- [x] 4.10 Output `CD:<path>` for shell wrapper to capture

## 5. CLI Command: pwt close

- [x] 5.1 Identify if current directory is a PWT-managed worktree
- [x] 5.2 Get uncommitted changes summary (`git status --short`)
- [x] 5.3 Get commits ahead/behind remote (`git rev-list`)
- [x] 5.4 Display change summary to user
- [x] 5.5 Require confirmation if uncommitted changes exist
- [x] 5.6 Execute `git worktree remove <path>`
- [x] 5.7 Remove worktree directory if still exists
- [x] 5.8 Remove entry from worktree index
- [x] 5.9 Output `CD:<original-repo-path>` to return to main repo

## 6. CLI Command: pwt ls

- [x] 6.1 Get current repo name
- [x] 6.2 Read or regenerate worktree index
- [x] 6.3 Get current working directory for asterisk marker
- [x] 6.4 Format output table (name, branch, path, modified date)
- [x] 6.5 Mark current worktree with `*` in output
- [x] 6.6 Handle empty list with friendly message
- [x] 6.7 Exit with code 0

## 7. CLI Command: pwt open

- [x] 7.1 Parse command arguments (worktree-name optional)
- [x] 7.2 If no name provided, display interactive list from index
- [x] 7.3 Validate worktree exists at `~/.worktrees/<repo>/<name>`
- [x] 7.4 Display error if worktree not found, suggest `pwt ls`
- [x] 7.5 Output `CD:<worktree-path>` for shell wrapper
- [x] 7.6 Exit with non-zero code on error

## 8. Shell Integration

- [x] 8.1 Create `SHELL_WRAPPER.md` with installation instructions
- [x] 8.2 Provide zsh wrapper function code
- [x] 8.3 Provide bash wrapper function code
- [x] 8.4 Add `--help` documentation about shell wrapper requirement
- [x] 8.5 Detect when running without wrapper (check `PWT_WRAPPER` env var)
- [x] 8.6 Show warning if CD: output won't work without wrapper

## 9. Testing & Polish

- [x] 9.1 Create test script for `pwt new` with various scenarios
- [x] 9.2 Create test script for `pwt close` with/without changes
- [x] 9.3 Create test script for `pwt ls` and `pwt open`
- [x] 9.4 Test nested directory execution (subdirectory of repo)
- [x] 9.5 Test worktree subdirectory execution (run from within worktree)
- [x] 9.6 Add `--version` flag
- [x] 9.7 Write README with installation and usage
- [x] 9.8 Test `bun install -g .` installation

## 10. Setup Command

- [x] 10.1 Create `pwt setup` command
- [x] 10.2 Detect .zshrc and .bashrc files
- [x] 10.3 Check if wrapper already installed
- [x] 10.4 Prompt user for confirmation
- [x] 10.5 Append wrapper to shell config file
- [x] 10.6 Show instructions to reload shell
