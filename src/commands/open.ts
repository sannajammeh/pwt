import { Command } from "commander";
import { select } from "@inquirer/prompts";
import { findRepoRoot, getRepoName } from "../utils/git";
import { readIndex, getWorktreePath } from "../utils/index-manager";
import { PWTError } from "../utils/exec";
import { existsSync } from "fs";

export function createOpenCommand(): Command {
  const command = new Command("open")
    .description("Open an existing worktree")
    .argument("[worktree-name]", "Name of the worktree to open")
    .action(async (worktreeName?: string) => {
      try {
        const cwd = process.cwd();
        
        // 7.1 Parse command arguments
        const repoRoot = findRepoRoot(cwd);
        const repoName = getRepoName(repoRoot);
        
        // 7.2 If no name provided, display interactive list
        let selectedName = worktreeName;
        if (!selectedName) {
          const entries = readIndex(repoName);
          
          if (entries.length === 0) {
            console.log("No worktrees found for this repository.");
            console.log("Use 'pwt new <name>' to create one.");
            process.exit(0);
          }
          
          const choices = entries.map(e => ({
            name: `${e.name} (${e.branch})`,
            value: e.name,
          }));
          
          selectedName = await select({
            message: "Select a worktree to open:",
            choices,
          });
        }
        
        // 7.3 Validate worktree exists
        const worktreePath = getWorktreePath(repoName, selectedName);
        
        if (!existsSync(worktreePath)) {
          // 7.4 Display error if worktree not found
          console.error(`Error: Worktree '${selectedName}' not found`);
          console.error("Suggestion: Run 'pwt ls' to see available worktrees");
          process.exit(1);
        }
        
        // 7.5 Output CD: for shell wrapper
        console.log(`CD:${worktreePath}`);
        
        // 7.6 Exit with code 0 (success)
        process.exit(0);
        
      } catch (error) {
        if (error instanceof PWTError) {
          console.error(`Error: ${error.message}`);
          if (error.suggestion) {
            console.error(`Suggestion: ${error.suggestion}`);
          }
          process.exit(1);
        }
        throw error;
      }
    });
  
  return command;
}
