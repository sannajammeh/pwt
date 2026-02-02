import { createInterface } from "readline";

export async function promptConfirm(message: string, defaultValue = false): Promise<boolean> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stderr,
  });

  const hint = defaultValue ? "[Y/n]" : "[y/N]";

  return new Promise((resolve) => {
    rl.question(`${message} ${hint} `, (answer) => {
      rl.close();
      const trimmed = answer.trim().toLowerCase();
      if (trimmed === "") {
        resolve(defaultValue);
      } else {
        resolve(trimmed === "y" || trimmed === "yes");
      }
    });
  });
}

export async function promptInput(message: string, validate?: (value: string) => string | true): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stderr,
  });

  return new Promise((resolve) => {
    const ask = () => {
      rl.question(`${message} `, (answer) => {
        const trimmed = answer.trim();
        if (validate) {
          const result = validate(trimmed);
          if (result !== true) {
            process.stderr.write(`${result}\n`);
            ask();
            return;
          }
        }
        rl.close();
        resolve(trimmed);
      });
    };
    ask();
  });
}
