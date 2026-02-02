## ADDED Requirements

### Requirement: Repository root discovery
The system SHALL find the repository root from any nested subdirectory.

#### Scenario: Execute from nested directory
- **WHEN** user runs any pwt command from a subdirectory of a git repository
- **THEN** system walks up directory tree to find `.git` directory
- **AND** uses discovered root for all git operations
- **AND** worktree path is based on repository root name

#### Scenario: Execute from worktree subdirectory
- **WHEN** user runs pwt command from within a worktree's subdirectory
- **THEN** system finds the worktree's root
- **AND** traces back to original repository
- **AND** executes command in context of original repository

#### Scenario: Execute outside git repository
- **WHEN** user runs pwt command outside any git repository
- **THEN** system displays error "Not a git repository (or any parent directory)"
- **AND** exits with non-zero code
