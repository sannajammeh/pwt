import { Command } from "commander";
import { existsSync, readFileSync, appendFileSync } from "fs";
import { join } from "path";
import { promptConfirm } from "../utils/prompt";
import { PWTError } from "../utils/exec";

const ZSH_WRAPPER = `
# PWT (Personal Worktree) shell wrapper
pwt() {
  PWT_WRAPPER=1 command pwtx "$@" | while IFS= read -r line; do
    if [[ $line == CD:* ]]; then
      cd "\${line#CD:}"
    else
      echo "$line"
    fi
  done
}
`;

const BASH_WRAPPER = `
# PWT (Personal Worktree) shell wrapper
pwt() {
  PWT_WRAPPER=1 command pwtx "$@" | while IFS= read -r line; do
    if [[ $line == CD:* ]]; then
      cd "\${line#CD:}"
    else
      echo "$line"
    fi
  done
}
`;

export function createSetupCommand(): Command {
  const command = new Command("setup")
    .description("Setup shell wrapper for automatic directory switching")
    .action(async () => {
      try {
        const home = process.env.HOME || "";
        const zshrcPath = join(home, ".zshrc");
        const bashrcPath = join(home, ".bashrc");
        
        const hasZshrc = existsSync(zshrcPath);
        const hasBashrc = existsSync(bashrcPath);
        
        if (!hasZshrc && !hasBashrc) {
          console.log("No shell configuration file found.");
          console.log("Supported shells: zsh, bash");
          console.log("\nTo manually install the wrapper, add this to your shell config:\n");
          console.log(ZSH_WRAPPER);
          process.exit(0);
        }
        
        console.log("Shell wrapper setup for PWT\n");
        
        if (hasZshrc) {
          const zshrcContent = readFileSync(zshrcPath, "utf-8");
          
          if (zshrcContent.includes("pwt()")) {
            console.log("✓ PWT wrapper already installed in ~/.zshrc");
          } else {
            const shouldInstall = await promptConfirm("Install PWT wrapper in ~/.zshrc?", true);
            
            if (shouldInstall) {
              appendFileSync(zshrcPath, ZSH_WRAPPER);
              console.log("✓ Shell wrapper added to ~/.zshrc");
              console.log("  Run 'source ~/.zshrc' to activate");
            }
          }
        }
        
        if (hasBashrc) {
          const bashrcContent = readFileSync(bashrcPath, "utf-8");
          
          if (bashrcContent.includes("pwt()")) {
            console.log("✓ PWT wrapper already installed in ~/.bashrc");
          } else {
            const shouldInstall = await promptConfirm("Install PWT wrapper in ~/.bashrc?", true);
            
            if (shouldInstall) {
              appendFileSync(bashrcPath, BASH_WRAPPER);
              console.log("✓ Shell wrapper added to ~/.bashrc");
              console.log("  Run 'source ~/.bashrc' to activate");
            }
          }
        }
        
        console.log("\nSetup complete! The shell wrapper enables automatic directory switching.");
        
      } catch (error) {
        if (error instanceof PWTError) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });
  
  return command;
}
