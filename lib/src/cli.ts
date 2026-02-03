#!/usr/bin/env node

import { defineCommand, runMain } from "citty";
import { newCommand } from "./commands/new";
import { closeCommand } from "./commands/close";
import { lsCommand } from "./commands/ls";
import { openCommand } from "./commands/open";
import { setupCommand } from "./commands/setup";
import { readFileSync } from "fs";
import { join } from "path";

const packageJson = JSON.parse(readFileSync(join(__dirname, "../package.json"), "utf-8"));

const main = defineCommand({
  meta: {
    name: "pwt",
    version: packageJson.version,
    description: "Personal Worktree - A CLI for managing Git worktrees",
  },
  subCommands: {
    new: newCommand,
    close: closeCommand,
    ls: lsCommand,
    open: openCommand,
    setup: setupCommand,
  },
});

// Detect when running without wrapper
if (!process.env.PWT_WRAPPER) {
  console.log("⚠️  Warning: PWT is not running with the shell wrapper.");
  console.log("   Directory switching (cd) will not work.");
  console.log("   Run 'pwt setup' to install the shell wrapper.");
  console.log("   See SHELL_WRAPPER.md for manual instructions.\n");
}

runMain(main);
