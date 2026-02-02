import { Command } from "commander";
import { confirm } from "@inquirer/prompts";
import { execGit, PWTError } from "../utils/exec";
import { findRepoRoot, isWorktree, getOriginalRepo, expandHome } from "../utils/git";
import { getUncommittedChanges, getCommitsAheadBehind } from "../utils/branch";
import { removeFromIndex, readIndex } from "../utils/index-manager";
import { existsSync, rmSync } from "fs";
import { join } from "path";

export function createCloseCommand(): Command {
  const command = new Command("close")
    .description("Close the current worktree")
    .action(async () => {
      try {
        const cwd = process.cwd();
        
        // 5.1 Identify if current directory is a PWT-managed worktree
        if (!isWorktree(cwd)) {
          throw new PWTError(
            "Not in a worktree directory",
            "NOT_A_WORKTREE",
            "Run this command from within a worktree created with 'pwt new'"
          );
        }
        
        // Get worktree info
        const gitFile = join(cwd, ".git");
        const originalRepo = getOriginalRepo(gitFile);
        const repoName = originalRepo.split("/").pop() || "unknown";
        const worktreeName = cwd.split("/").pop() || "unknown";
        
        // 5.2 Get uncommitted changes summary
        const uncommitted = getUncommittedChanges(cwd);
        
        // 5.3 Get commits ahead/behind remote
        const currentBranch = execGit(["rev-parse", "--abbrev-ref", "HEAD"], cwd);
        const { ahead, behind } = getCommitsAheadBehind(cwd, currentBranch);
        
        // 5.4 Display change summary
        console.log("Worktree Summary:");
        console.log(`  Name: ${worktreeName}`);
        console.log(`  Branch: ${currentBranch}`);
        console.log(`  Path: ${cwd}`);
        
        if (uncommitted) {
          console.log("\nUncommitted changes:");
          console.log(uncommitted);
        } else {
          console.log("\nNo uncommitted changes");
        }
        
        if (ahead > 0 || behind > 0) {
          console.log(`\nCommits: ${ahead} ahead, ${behind} behind remote`);
        }
        
        // 5.5 Require confirmation if uncommitted changes exist
        if (uncommitted) {
          const confirmed = await confirm({
            message: "You have uncommitted changes. Close anyway?",
            default: false,
          });
          
          if (!confirmed) {
            console.log("Close cancelled.");
            process.exit(0);
          }
        }
        
        // 5.6 Execute git worktree remove
        console.log("\nRemoving worktree...");
        try {
          execGit(["worktree", "remove", cwd], originalRepo);
        } catch {
          // Worktree might already be removed or force required
        }
        
        // 5.7 Remove worktree directory if still exists
        if (existsSync(cwd)) {
          rmSync(cwd, { recursive: true, force: true });
        }
        
        // 5.8 Remove entry from worktree index
        removeFromIndex(repoName, worktreeName);
        
        console.log(`Worktree '${worktreeName}' closed.`);
        
        // 5.9 Output CD: to return to original repo
        console.log(`CD:${originalRepo}`);
        
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
