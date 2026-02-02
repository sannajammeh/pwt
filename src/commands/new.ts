import { Command } from "commander";
import { input, select } from "@inquirer/prompts";
import { execGit, commandExists, execCommand, PWTError } from "../utils/exec";
import { findRepoRoot, getRepoName, isWorktree, getOriginalRepo, expandHome } from "../utils/git";
import { getCurrentBranch } from "../utils/branch";
import { addToIndex, getWorktreePath, ensureWorktreesDir, readIndex } from "../utils/index-manager";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

export function createNewCommand(): Command {
  const command = new Command("new")
    .description("Create a new worktree")
    .argument("[worktree-name]", "Name for the worktree")
    .argument("[branch]", "Branch to checkout (defaults to current branch)")
    .option("-b, --branch <branch>", "Specify branch to checkout")
    .action(async (worktreeName?: string, branchArg?: string, options?: { branch?: string }) => {
      try {
        // 4.1 Parse command arguments
        const cwd = process.cwd();
        const repoRoot = findRepoRoot(cwd);
        const repoName = getRepoName(repoRoot);
        
        // Check if we're already in a worktree
        if (isWorktree(cwd)) {
          // Get the original repo
          const gitFile = join(cwd, ".git");
          const originalRepo = getOriginalRepo(gitFile);
          // Continue with original repo context
        }
        
        // 4.2 Interactive prompt for worktree name if not provided
        let finalWorktreeName = worktreeName;
        if (!finalWorktreeName) {
          finalWorktreeName = await input({
            message: "Enter worktree name:",
            validate: (value) => value.trim().length > 0 || "Name is required",
          });
        }
        
        // 4.3 Determine source branch
        const specifiedBranch = options?.branch || branchArg;
        const currentBranch = getCurrentBranch(repoRoot);
        
        // 4.4 Calculate worktree path
        ensureWorktreesDir();
        let worktreePath = getWorktreePath(repoName, finalWorktreeName);
        
        // 4.5 Handle name collisions with numeric suffix
        const existingEntries = readIndex(repoName);
        let suffix = 1;
        let uniqueName = finalWorktreeName;
        while (existingEntries.some(e => e.name === uniqueName) || existsSync(worktreePath)) {
          suffix++;
          uniqueName = `${finalWorktreeName}-${suffix}`;
          worktreePath = getWorktreePath(repoName, uniqueName);
        }
        
        // Create parent directory
        const parentDir = join(worktreePath, "..");
        if (!existsSync(parentDir)) {
          mkdirSync(parentDir, { recursive: true });
        }
        
        // 4.6 Execute git worktree add
        // If branch specified: checkout that branch
        // If no branch: create new branch with worktree name from current branch
        if (specifiedBranch) {
          console.log(`Creating worktree '${uniqueName}' from branch '${specifiedBranch}'...`);
          execGit(["worktree", "add", worktreePath, specifiedBranch], repoRoot);
        } else {
          console.log(`Creating worktree '${uniqueName}' with new branch '${uniqueName}' from '${currentBranch}'...`);
          execGit(["worktree", "add", "-b", uniqueName, worktreePath], repoRoot);
        }
        
        // 4.7 Detect ni command availability
        const hasNi = commandExists("ni");
        
        // 4.8 Execute ni install if available
        if (hasNi) {
          console.log("Installing dependencies with ni...");
          try {
            execCommand("ni install", worktreePath);
            console.log("Dependencies installed.");
          } catch {
            console.log("Note: ni install failed, you may need to run it manually.");
          }
        }
        
        // 4.9 Add entry to worktree index
        const worktreeBranch = specifiedBranch || uniqueName;
        addToIndex(repoName, {
          name: uniqueName,
          path: worktreePath,
          branch: worktreeBranch,
          createdAt: new Date().toISOString(),
        });
        
        console.log(`Worktree '${uniqueName}' created successfully.`);
        
        // 4.10 Output CD: for shell wrapper
        console.log(`CD:${worktreePath}`);
        
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
