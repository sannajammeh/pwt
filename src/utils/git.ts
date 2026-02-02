import { existsSync, lstatSync, readFileSync } from "fs";
import { join, dirname, basename } from "path";
import { PWTError } from "./exec";

export function expandHome(path: string): string {
  if (path.startsWith("~/")) {
    return join(process.env.HOME || "", path.slice(2));
  }
  return path;
}

export function findRepoRoot(cwd: string): string {
  let current = cwd;
  
  while (current !== "/") {
    const gitPath = join(current, ".git");
    
    if (existsSync(gitPath)) {
      return current;
    }
    
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  
  throw new PWTError(
    "Not a git repository (or any parent directory)",
    "NOT_A_REPO",
    "Run this command from within a git repository"
  );
}

export function getOriginalRepo(worktreeGitFile: string): string {
  const content = readFileSync(worktreeGitFile, "utf-8");
  const match = content.match(/gitdir:\s*(.+)/);
  
  if (!match) {
    throw new PWTError(
      "Invalid .git file format",
      "INVALID_GITFILE",
      "The .git file appears to be corrupted"
    );
  }
  
  const gitdir = match[1]?.trim();
  if (!gitdir) {
    throw new PWTError(
      "Invalid .git file format",
      "INVALID_GITFILE",
      "The .git file appears to be corrupted"
    );
  }
  const worktreesIndex = gitdir.indexOf("/worktrees/");
  
  if (worktreesIndex === -1) {
    return dirname(gitdir);
  }
  
  return gitdir.substring(0, worktreesIndex);
}

export function getRepoName(repoRoot: string): string {
  return basename(repoRoot);
}

export function isWorktree(cwd: string): boolean {
  const gitPath = join(cwd, ".git");
  
  if (!existsSync(gitPath)) {
    return false;
  }
  
  const stat = lstatSync(gitPath);
  return stat.isFile();
}
