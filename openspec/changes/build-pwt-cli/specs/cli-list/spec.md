## ADDED Requirements

### Requirement: List repository worktrees
The system SHALL display all active worktrees for the current repository.

#### Scenario: List worktrees
- **WHEN** user runs `pwt ls`
- **THEN** system displays table of all worktrees
- **AND** shows worktree name, branch, path, and last modified date
- **AND** marks current worktree with asterisk (*)

#### Scenario: Empty worktree list
- **WHEN** user runs `pwt ls` and no worktrees exist
- **THEN** system displays "No worktrees found for this repository"
- **AND** exits with code 0
