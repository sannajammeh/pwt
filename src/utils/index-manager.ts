import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import type { WorktreeEntry } from "../types";
import { expandHome } from "./git";

const WORKTREES_DIR = expandHome("~/.worktrees");

export function getWorktreesDir(): string {
  return WORKTREES_DIR;
}

export function ensureWorktreesDir(): void {
  if (!existsSync(WORKTREES_DIR)) {
    mkdirSync(WORKTREES_DIR, { recursive: true });
  }
}

export function getIndexPath(repoName: string): string {
  return join(WORKTREES_DIR, `${repoName}.index.txt`);
}

export function getWorktreePath(repoName: string, worktreeName: string): string {
  return join(WORKTREES_DIR, repoName, worktreeName);
}

export function readIndex(repoName: string): WorktreeEntry[] {
  const indexPath = getIndexPath(repoName);
  
  if (!existsSync(indexPath)) {
    return [];
  }
  
  const content = readFileSync(indexPath, "utf-8");
  const lines = content.trim().split("\n").filter(line => line.trim());
  
  return lines.map(line => {
    const [name, path, branch, createdAt] = line.split("|");
    return {
      name: name || "",
      path: path || "",
      branch: branch || "",
      createdAt: createdAt || new Date().toISOString(),
    };
  }).filter(entry => entry.name);
}

export function writeIndex(repoName: string, entries: WorktreeEntry[]): void {
  ensureWorktreesDir();
  const indexPath = getIndexPath(repoName);
  
  const content = entries
    .map(e => `${e.name}|${e.path}|${e.branch}|${e.createdAt}`)
    .join("\n");
  
  writeFileSync(indexPath, content + (content ? "\n" : ""));
}

export function addToIndex(repoName: string, entry: WorktreeEntry): void {
  const entries = readIndex(repoName);
  const existingIndex = entries.findIndex(e => e.name === entry.name);
  
  if (existingIndex >= 0) {
    entries[existingIndex] = entry;
  } else {
    entries.push(entry);
  }
  
  writeIndex(repoName, entries);
}

export function removeFromIndex(repoName: string, worktreeName: string): void {
  const entries = readIndex(repoName);
  const filtered = entries.filter(e => e.name !== worktreeName);
  writeIndex(repoName, filtered);
}

export function regenerateIndex(repoName: string): WorktreeEntry[] {
  const repoDir = join(WORKTREES_DIR, repoName);
  
  if (!existsSync(repoDir)) {
    writeIndex(repoName, []);
    return [];
  }
  
  const entries: WorktreeEntry[] = [];
  const items = readdirSync(repoDir, { withFileTypes: true });
  
  for (const item of items) {
    if (item.isDirectory()) {
      const worktreePath = join(repoDir, item.name);
      const gitDir = join(worktreePath, ".git");
      
      if (existsSync(gitDir)) {
        try {
          const stat = statSync(worktreePath);
          entries.push({
            name: item.name,
            path: worktreePath,
            branch: "unknown",
            createdAt: stat.mtime.toISOString(),
          });
        } catch {
          // Skip directories we can't stat
        }
      }
    }
  }
  
  writeIndex(repoName, entries);
  return entries;
}
