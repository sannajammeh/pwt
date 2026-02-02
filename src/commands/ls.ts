import { Command } from "commander";
import Table from "cli-table3";
import { findRepoRoot, getRepoName } from "../utils/git";
import { readIndex, regenerateIndex } from "../utils/index-manager";
import { PWTError } from "../utils/exec";

export function createLsCommand(): Command {
  const command = new Command("ls")
    .description("List all worktrees for the current repository")
    .action(() => {
      try {
        const cwd = process.cwd();
        
        // 6.1 Get current repo name
        const repoRoot = findRepoRoot(cwd);
        const repoName = getRepoName(repoRoot);
        
        // 6.2 Read or regenerate worktree index
        let entries = readIndex(repoName);
        if (entries.length === 0) {
          entries = regenerateIndex(repoName);
        }
        
        // 6.3 Get current working directory for asterisk marker
        const currentDir = cwd;
        
        // 6.4 Format output table
        const table = new Table({
          head: ["Name", "Branch", "Path", "Created"],
          style: {
            head: ["cyan"],
            border: ["gray"],
          },
        });
        
        for (const entry of entries) {
          // 6.5 Mark current worktree with * in output
          const name = entry.path === currentDir ? `* ${entry.name}` : entry.name;
          const created = new Date(entry.createdAt).toLocaleDateString();
          table.push([name, entry.branch, entry.path, created]);
        }
        
        if (entries.length === 0) {
          // 6.6 Handle empty list
          console.log("No worktrees found for this repository.");
          console.log("Use 'pwt new <name>' to create one.");
        } else {
          console.log(`\nWorktrees for ${repoName}:\n`);
          console.log(table.toString());
          console.log("\n* indicates current directory");
        }
        
        // 6.7 Exit with code 0
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
