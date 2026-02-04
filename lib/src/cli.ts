#!/usr/bin/env node

import { defineCommand, runMain, runCommand } from "citty";
import { newCommand } from "./commands/new";
import { closeCommand } from "./commands/close";
import { lsCommand } from "./commands/ls";
import { openCommand } from "./commands/open";
import { setupCommand } from "./commands/setup";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { findRepoRoot, getRepoName } from "./utils/git";
import { getWorktreePath } from "./utils/index-manager";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, "../package.json"), "utf-8"));

const SUBCOMMANDS = ["new", "close", "ls", "open", "setup", "--help", "-h", "--version", "-v"];

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

// Smart routing: intercept args before citty processes them
async function smartRoute() {
  const args = process.argv.slice(2);
  const firstArg = args[0];

  // If no args or first arg is a subcommand/flag, let citty handle it
  if (!firstArg || SUBCOMMANDS.includes(firstArg)) {
    return runMain(main);
  }

  // First arg is a worktree name - route to new or open
  const worktreeName = firstArg;
  const bFlagIndex = args.indexOf("-b");
  const baseBranch = bFlagIndex !== -1 ? args[bFlagIndex + 1] : undefined;

  try {
    const cwd = process.cwd();
    const repoRoot = findRepoRoot(cwd);
    const repoName = getRepoName(repoRoot);
    const worktreePath = getWorktreePath(repoName, worktreeName);

    if (existsSync(worktreePath)) {
      await runCommand(openCommand, { rawArgs: [worktreeName] });
    } else {
      const rawArgs = [worktreeName];
      if (baseBranch) rawArgs.push("-b", baseBranch);
      await runCommand(newCommand, { rawArgs });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
}

// Detect when running without wrapper
if (!process.env.PWT_WRAPPER) {
  console.log("⚠️  Warning: PWT is not running with the shell wrapper.");
  console.log("   Directory switching (cd) will not work.");
  console.log("   Run 'pwt setup' to install the shell wrapper.");
  console.log("   See SHELL_WRAPPER.md for manual instructions.\n");
}

smartRoute();
