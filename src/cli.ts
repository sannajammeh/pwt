#!/usr/bin/env bun

import { Command } from "commander";
import { createNewCommand } from "./commands/new";
import { createCloseCommand } from "./commands/close";
import { createLsCommand } from "./commands/ls";
import { createOpenCommand } from "./commands/open";
import { createSetupCommand } from "./commands/setup";
import { readFileSync } from "fs";
import { join } from "path";

const packageJson = JSON.parse(readFileSync(join(__dirname, "../package.json"), "utf-8"));

const program = new Command()
  .name("pwt")
  .description("Personal Worktree - A CLI for managing Git worktrees")
  .version(packageJson.version, "-v, --version", "Display version number");

// 8.5 Detect when running without wrapper
if (!process.env.PWT_WRAPPER) {
  // 8.6 Show warning if CD: output won't work without wrapper
  console.log("⚠️  Warning: PWT is not running with the shell wrapper.");
  console.log("   Directory switching (cd) will not work.");
  console.log("   Run 'pwt setup' to install the shell wrapper.");
  console.log("   See SHELL_WRAPPER.md for manual instructions.\n");
}

program
  .addCommand(createNewCommand())
  .addCommand(createCloseCommand())
  .addCommand(createLsCommand())
  .addCommand(createOpenCommand())
  .addCommand(createSetupCommand());

// 8.4 Add --help documentation about shell wrapper
program.on("--help", () => {
  console.log("");
  console.log("Shell Integration:");
  console.log("  For automatic directory switching, run 'pwt setup'.");
  console.log("  See SHELL_WRAPPER.md for manual installation instructions.");
  console.log("");
  console.log("Examples:");
  console.log("  $ pwt setup              # Install shell wrapper");
  console.log("  $ pwt new feature-branch");
  console.log("  $ pwt new hotfix origin/main");
  console.log("  $ pwt ls");
  console.log("  $ pwt open feature-branch");
  console.log("  $ pwt close");
});

program.parse();
