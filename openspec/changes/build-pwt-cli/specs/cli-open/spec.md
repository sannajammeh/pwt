## ADDED Requirements

### Requirement: Open existing worktree
The system SHALL switch to an existing worktree directory.

#### Scenario: Open by name
- **WHEN** user runs `pwt open feature-branch`
- **THEN** system validates worktree exists at `~/.worktrees/<repo-name>/feature-branch`
- **AND** terminal session changes to that worktree directory

#### Scenario: Open with interactive prompt
- **WHEN** user runs `pwt open` without arguments
- **THEN** system displays list of available worktrees
- **AND** prompts user to select one
- **AND** changes to selected worktree directory

#### Scenario: Open non-existent worktree
- **WHEN** user runs `pwt open non-existent`
- **THEN** system displays error "Worktree 'non-existent' not found"
- **AND** suggests running `pwt ls` to see available worktrees
- **AND** exits with non-zero code
