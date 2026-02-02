import { execGit } from "./exec";

export function getCurrentBranch(repoRoot: string): string {
  return execGit(["rev-parse", "--abbrev-ref", "HEAD"], repoRoot);
}

export function getUncommittedChanges(repoRoot: string): string {
  return execGit(["status", "--short"], repoRoot);
}

export function getCommitsAheadBehind(repoRoot: string, branch: string): { ahead: number; behind: number } {
  try {
    const upstream = execGit(["rev-parse", "--abbrev-ref", `${branch}@{upstream}`], repoRoot);
    const ahead = execGit(["rev-list", `${upstream}..${branch}`, "--count"], repoRoot);
    const behind = execGit(["rev-list", `${branch}..${upstream}`, "--count"], repoRoot);
    
    return {
      ahead: parseInt(ahead, 10) || 0,
      behind: parseInt(behind, 10) || 0,
    };
  } catch {
    return { ahead: 0, behind: 0 };
  }
}
