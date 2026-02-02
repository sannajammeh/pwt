import { execSync } from "child_process";

export class PWTError extends Error {
  constructor(
    message: string,
    public code: string,
    public suggestion?: string
  ) {
    super(message);
    this.name = "PWTError";
  }
}

export function handleError(error: unknown): never {
  if (error instanceof PWTError) {
    console.error(`Error: ${error.message}`);
    if (error.suggestion) {
      console.error(`Suggestion: ${error.suggestion}`);
    }
    process.exit(1);
  }
  throw error;
}

export function execGit(args: string[], cwd?: string): string {
  try {
    return execSync(`git ${args.join(" ")}`, {
      cwd,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
  } catch (error: any) {
    const stderr = error.stderr?.toString() || "";
    throw new PWTError(
      `Git command failed: git ${args.join(" ")}\n${stderr}`,
      "GIT_ERROR",
      "Check if you're in a git repository and have git installed"
    );
  }
}

export function execCommand(command: string, cwd?: string): string {
  try {
    return execSync(command, {
      cwd,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
  } catch (error) {
    return "";
  }
}

export function commandExists(command: string): boolean {
  try {
    execSync(`which ${command}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
