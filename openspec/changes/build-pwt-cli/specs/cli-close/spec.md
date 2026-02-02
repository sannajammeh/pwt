## ADDED Requirements

### Requirement: Close worktree with summary
The system SHALL close (remove) a worktree and provide a summary of changes.

#### Scenario: Close current worktree
- **WHEN** user runs `pwt close` from within a worktree
- **THEN** system shows summary of uncommitted changes
- **AND** shows list of commits ahead/behind remote
- **AND** removes the worktree directory
- **AND** prunes the git worktree reference
- **AND** returns to original repository directory

#### Scenario: Close with no changes
- **WHEN** user runs `pwt close` and worktree has no changes
- **THEN** system confirms "No uncommitted changes"
- **AND** removes worktree without prompting

#### Scenario: Close with uncommitted changes
- **WHEN** user runs `pwt close` with uncommitted changes
- **THEN** system displays diffstat of modified files
- **AND** warns user about uncommitted changes
- **AND** requires confirmation before closing
