import { defineCommand } from "citty";
import { findRepoRoot, getRepoName } from "../utils/git";
import { readIndex, getWorktreePath } from "../utils/index-manager";
import { PWTError } from "../utils/exec";
import { promptSelect } from "../utils/prompt";
import { existsSync } from "fs";

export const openCommand = defineCommand({
  meta: {
    name: "open",
    description: "Open an existing worktree",
  },
  args: {
    name: {
      type: "positional",
      description: "Name of the worktree to open",
      required: false,
    },
  },
  async run({ args }) {
    try {
      const cwd = process.cwd();

      const repoRoot = findRepoRoot(cwd);
      const repoName = getRepoName(repoRoot);

      // If no name provided, display interactive list
      let selectedName = args.name;
      if (!selectedName) {
        const entries = readIndex(repoName);

        if (entries.length === 0) {
          console.log("📭 No worktrees found for this repository.");
          console.log("   Use 'pwt new <name>' to create one.");
          process.exit(0);
        }

        const options = entries.map(e => ({
          label: `${e.name} (${e.branch})`,
          value: e.name,
        }));

        selectedName = await promptSelect("Select a worktree to open:", options);
      }

      // Validate worktree exists
      const worktreePath = getWorktreePath(repoName, selectedName);

      if (!existsSync(worktreePath)) {
        console.error(`Error: Worktree '${selectedName}' not found`);
        console.error("Suggestion: Run 'pwt ls' to see available worktrees");
        process.exit(1);
      }

      // Output CD: for shell wrapper
      console.log(`CD:${worktreePath}`);

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
  },
});
