## ADDED Requirements

### Requirement: Create worktree from current branch
The system SHALL create a new git worktree from the current branch when `pwt new` is invoked without branch arguments.

#### Scenario: Create worktree with provided name
- **WHEN** user runs `pwt new feature-branch`
- **THEN** a worktree is created at `~/.worktrees/<repo-name>/feature-branch`
- **AND** the worktree is checked out from the current branch
- **AND** terminal session changes to the new worktree directory

#### Scenario: Create worktree with interactive prompt
- **WHEN** user runs `pwt new` without arguments
- **THEN** system prompts for worktree name
- **AND** creates worktree at `~/.worktrees/<repo-name>/<provided-name>`
- **AND** terminal session changes to the new worktree directory

### Requirement: Create worktree from specified remote branch
The system SHALL create a worktree from a specified remote branch when branch is provided.

#### Scenario: Create from origin/main explicitly
- **WHEN** user runs `pwt new worktree-name origin/main`
- **THEN** worktree is created from origin/main branch
- **AND** local branch is created tracking origin/main
- **AND** terminal session changes to the new worktree directory

#### Scenario: Create with -b flag for prompt mode with branch
- **WHEN** user runs `pwt new -b origin/main`
- **THEN** system prompts for worktree name
- **AND** creates worktree from origin/main after name is provided
- **AND** terminal session changes to the new worktree directory

### Requirement: Worktree storage location
The system SHALL place all worktrees in a centralized location under the user's home directory.

#### Scenario: Worktree path structure
- **WHEN** any worktree is created
- **THEN** it is placed at `~/.worktrees/<original-repo-name>/<worktree-name>`
- **AND** parent directories are created if they do not exist

### Requirement: Auto-install dependencies with ni
The system SHALL detect and execute `ni install` when the `ni` command is available globally.

#### Scenario: ni is available
- **WHEN** worktree is created and `ni` command exists in PATH
- **THEN** system executes `ni install` in the new worktree directory
- **AND** installation output is displayed to user

#### Scenario: ni is not available
- **WHEN** worktree is created and `ni` command does not exist
- **THEN** worktree is created without running install command
- **AND** no error is shown for missing ni
