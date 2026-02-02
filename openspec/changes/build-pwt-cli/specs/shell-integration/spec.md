## ADDED Requirements

### Requirement: Shell wrapper for auto-cd
The system SHALL provide a shell function that enables automatic directory switching.

#### Scenario: Shell wrapper installation
- **WHEN** user installs pwt
- **THEN** installation instructions include shell wrapper code
- **AND** wrapper code is compatible with zsh and bash

#### Scenario: Auto-cd behavior
- **WHEN** pwt command outputs line starting with "CD:"
- **THEN** shell wrapper extracts path from "CD:<path>"
- **AND** changes current directory to that path
- **AND** suppresses the CD: output from display

#### Scenario: Normal output passthrough
- **WHEN** pwt command outputs without "CD:" prefix
- **THEN** shell wrapper passes output through unchanged
- **AND** does not attempt directory change
