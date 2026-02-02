import { defineCommand } from "citty";
import { execGit, PWTError } from "../utils/exec";
import { findWorktreeRoot, getOriginalRepo } from "../utils/git";
import { getUncommittedChanges, getCommitsAheadBehind } from "../utils/branch";
import { removeFromIndex } from "../utils/index-manager";
import { promptConfirm } from "../utils/prompt";
import { existsSync, rmSync } from "fs";
import { join } from "path";

export const closeCommand = defineCommand({
  meta: {
    name: "close",
    description: "Close the current worktree",
  },
  async run() {
    try {
      const cwd = process.cwd();

      // Identify if current directory is a PWT-managed worktree
      const worktreeRoot = findWorktreeRoot(cwd);
      if (!worktreeRoot) {
        throw new PWTError(
          "Not in a worktree directory",
          "NOT_A_WORKTREE",
          "Run this command from within a worktree created with 'pwt new'"
        );
      }

      // Get worktree info
      const gitFile = join(worktreeRoot, ".git");
      const originalRepo = getOriginalRepo(gitFile);
      const repoName = originalRepo.split("/").pop() || "unknown";
      const worktreeName = worktreeRoot.split("/").pop() || "unknown";

      // Get uncommitted changes summary
      const uncommitted = getUncommittedChanges(worktreeRoot);

      // Get commits ahead/behind remote
      const currentBranch = execGit(["rev-parse", "--abbrev-ref", "HEAD"], worktreeRoot);
      const { ahead, behind } = getCommitsAheadBehind(worktreeRoot, currentBranch);

      // Display change summary
      console.log("📋 Worktree Summary:");
      console.log(`   Name: ${worktreeName}`);
      console.log(`   Branch: ${currentBranch}`);
      console.log(`   Path: ${worktreeRoot}`);

      if (uncommitted) {
        console.log("\nUncommitted changes:");
        console.log(uncommitted);
      } else {
        console.log("\nNo uncommitted changes");
      }

      if (ahead > 0 || behind > 0) {
        console.log(`\nCommits: ${ahead} ahead, ${behind} behind remote`);
      }

      // Require confirmation if uncommitted changes exist
      if (uncommitted) {
        const confirmed = await promptConfirm("You have uncommitted changes. Close anyway?");

        if (!confirmed) {
          console.log("Close cancelled.");
          process.exit(0);
        }
      }

      // Execute git worktree remove
      console.log("\n🗑️  Removing worktree...");
      try {
        execGit(["worktree", "remove", worktreeRoot], originalRepo);
      } catch {
        // Worktree might already be removed or force required
      }

      // Remove worktree directory if still exists
      if (existsSync(worktreeRoot)) {
        rmSync(worktreeRoot, { recursive: true, force: true });
      }

      // Remove entry from worktree index
      removeFromIndex(repoName, worktreeName);

      console.log(`👋 Worktree '${worktreeName}' closed.`);

      // Output CD: to return to original repo
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
  },
});
