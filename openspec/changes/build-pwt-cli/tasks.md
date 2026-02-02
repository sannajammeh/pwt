## 1. Project Setup

- [ ] 1.1 Initialize Bun project with `bun init` in pwt directory
- [ ] 1.2 Create `package.json` with CLI entry point (`bin` field)
- [ ] 1.3 Add TypeScript configuration (`tsconfig.json`)
- [ ] 1.4 Add CLI argument parser dependency (`commander` or `cac`)
- [ ] 1.5 Add prompt library for interactive mode (`@inquirer/prompts`)
- [ ] 1.6 Add table formatter for `ls` output (`cli-table3` or similar)
- [ ] 1.7 Create basic project structure (src/, src/commands/, src/utils/)

## 2. Core Infrastructure

- [ ] 2.1 Implement `findRepoRoot(cwd: string)` - walk up tree to find `.git`
- [ ] 2.2 Implement `getOriginalRepo(worktreeGitFile: string)` - parse `gitdir:` path
- [ ] 2.3 Implement `getRepoName(repoRoot: string)` - extract repo name from path
- [ ] 2.4 Implement `execGit(args: string[], cwd?: string)` - typed git command wrapper
- [ ] 2.5 Implement `getCurrentBranch(repoRoot: string)` - get active branch name
- [ ] 2.6 Implement `path utilities` - expand `~` to home directory
- [ ] 2.7 Create error handling utilities with user-friendly messages

## 3. Worktree Index Management

- [ ] 3.1 Define `WorktreeEntry` interface (name, path, branch, createdAt)
- [ ] 3.2 Implement `getIndexPath(repoName: string)` - `~/.worktrees/<repo>.index.txt`
- [ ] 3.3 Implement `readIndex(repoName: string)` - parse index file to entries
- [ ] 3.4 Implement `writeIndex(repoName: string, entries: WorktreeEntry[])` - serialize to file
- [ ] 3.5 Implement `addToIndex(repoName: string, entry: WorktreeEntry)` - append entry
- [ ] 3.6 Implement `removeFromIndex(repoName: string, worktreeName: string)` - filter entry
- [ ] 3.7 Implement `regenerateIndex(repoName: string)` - scan `~/.worktrees/<repo>/` directory

## 4. CLI Command: pwt new

- [ ] 4.1 Parse command arguments (worktree-name, branch, -b flag)
- [ ] 4.2 Implement interactive prompt for worktree name when not provided
- [ ] 4.3 Determine source branch (current branch or specified remote branch)
- [ ] 4.4 Calculate worktree path `~/.worktrees/<repo>/<name>`
- [ ] 4.5 Handle worktree name collisions with numeric suffix
- [ ] 4.6 Execute `git worktree add <path> <branch>`
- [ ] 4.7 Detect `ni` command availability (`which ni`)
- [ ] 4.8 Execute `ni install` in new worktree if ni available
- [ ] 4.9 Add entry to worktree index
- [ ] 4.10 Output `CD:<path>` for shell wrapper to capture

## 5. CLI Command: pwt close

- [ ] 5.1 Identify if current directory is a PWT-managed worktree
- [ ] 5.2 Get uncommitted changes summary (`git status --short`)
- [ ] 5.3 Get commits ahead/behind remote (`git rev-list`)
- [ ] 5.4 Display change summary to user
- [ ] 5.5 Require confirmation if uncommitted changes exist
- [ ] 5.6 Execute `git worktree remove <path>`
- [ ] 5.7 Remove worktree directory if still exists
- [ ] 5.8 Remove entry from worktree index
- [ ] 5.9 Output `CD:<original-repo-path>` to return to main repo

## 6. CLI Command: pwt ls

- [ ] 6.1 Get current repo name
- [ ] 6.2 Read or regenerate worktree index
- [ ] 6.3 Get current working directory for asterisk marker
- [ ] 6.4 Format output table (name, branch, path, modified date)
- [ ] 6.5 Mark current worktree with `*` in output
- [ ] 6.6 Handle empty list with friendly message
- [ ] 6.7 Exit with code 0

## 7. CLI Command: pwt open

- [ ] 7.1 Parse command arguments (worktree-name optional)
- [ ] 7.2 If no name provided, display interactive list from index
- [ ] 7.3 Validate worktree exists at `~/.worktrees/<repo>/<name>`
- [ ] 7.4 Display error if worktree not found, suggest `pwt ls`
- [ ] 7.5 Output `CD:<worktree-path>` for shell wrapper
- [ ] 7.6 Exit with non-zero code on error

## 8. Shell Integration

- [ ] 8.1 Create `SHELL_WRAPPER.md` with installation instructions
- [ ] 8.2 Provide zsh wrapper function code
- [ ] 8.3 Provide bash wrapper function code
- [ ] 8.4 Add `--help` documentation about shell wrapper requirement
- [ ] 8.5 Detect when running without wrapper (check `PWT_WRAPPER` env var)
- [ ] 8.6 Show warning if CD: output won't work without wrapper

## 9. Testing & Polish

- [ ] 9.1 Create test script for `pwt new` with various scenarios
- [ ] 9.2 Create test script for `pwt close` with/without changes
- [ ] 9.3 Create test script for `pwt ls` and `pwt open`
- [ ] 9.4 Test nested directory execution (subdirectory of repo)
- [ ] 9.5 Test worktree subdirectory execution (run from within worktree)
- [ ] 9.6 Add `--version` flag
- [ ] 9.7 Write README with installation and usage
- [ ] 9.8 Test `bun install -g .` installation
