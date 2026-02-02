import { defineCommand } from "citty";
import { execGit, commandExists, execCommand, PWTError } from "../utils/exec";
import { findRepoRoot, getRepoName, isWorktree } from "../utils/git";
import { promptInput } from "../utils/prompt";
import { getCurrentBranch } from "../utils/branch";
import { addToIndex, getWorktreePath, ensureWorktreesDir, readIndex } from "../utils/index-manager";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

export const newCommand = defineCommand({
  meta: {
    name: "new",
    description: "Create a new worktree",
  },
  args: {
    name: {
      type: "positional",
      description: "Name for the worktree",
      required: false,
    },
    branch: {
      type: "positional",
      description: "Branch to checkout (defaults to current branch)",
      required: false,
    },
    b: {
      type: "string",
      alias: "branch",
      description: "Specify branch to checkout",
    },
  },
  async run({ args }) {
    try {
      const cwd = process.cwd();
      const repoRoot = findRepoRoot(cwd);
      const repoName = getRepoName(repoRoot);

      // Check if we're already in a worktree (no-op, just continue)
      isWorktree(cwd);

      // Interactive prompt for worktree name if not provided
      let finalWorktreeName = args.name;
      if (!finalWorktreeName) {
        finalWorktreeName = await promptInput(
          "Enter worktree name:",
          (value) => value.length > 0 || "Name is required"
        );
      }

      // Determine source branch
      const specifiedBranch = args.b || args.branch;
      const currentBranch = getCurrentBranch(repoRoot);

      // Calculate worktree path
      ensureWorktreesDir();
      let worktreePath = getWorktreePath(repoName, finalWorktreeName);

      // Handle name collisions with numeric suffix
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

      // Execute git worktree add
      if (specifiedBranch) {
        console.log(`🌱 Creating worktree '${uniqueName}' from branch '${specifiedBranch}'...`);
        execGit(["worktree", "add", worktreePath, specifiedBranch], repoRoot);
      } else {
        console.log(`🌱 Creating worktree '${uniqueName}' with new branch '${uniqueName}' from '${currentBranch}'...`);
        execGit(["worktree", "add", "-b", uniqueName, worktreePath], repoRoot);
      }

      // Detect ni command availability
      const hasNi = commandExists("ni");

      // Execute ni install if available
      if (hasNi) {
        console.log("📦 Installing dependencies with ni...");
        try {
          execCommand("ni install", worktreePath);
          console.log("✅ Dependencies installed.");
        } catch {
          console.log("⚠️  ni install failed, you may need to run it manually.");
        }
      }

      // Add entry to worktree index
      const worktreeBranch = specifiedBranch || uniqueName;
      addToIndex(repoName, {
        name: uniqueName,
        path: worktreePath,
        branch: worktreeBranch,
        createdAt: new Date().toISOString(),
      });

      console.log(`✨ Worktree '${uniqueName}' created successfully.`);

      // Output CD: for shell wrapper
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
  },
});
