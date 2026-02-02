import { consola } from "consola";

export async function promptConfirm(message: string, defaultValue = false): Promise<boolean> {
  const result = await consola.prompt(message, {
    type: "confirm",
    initial: defaultValue,
  });
  if (typeof result === "symbol") {
    process.exit(0);
  }
  return result;
}

export async function promptInput(message: string, validate?: (value: string) => string | true): Promise<string> {
  const result = await consola.prompt(message, { type: "text" });
  if (typeof result === "symbol") {
    process.exit(0);
  }
  if (validate) {
    const validation = validate(result);
    if (validation !== true) {
      consola.error(validation);
      return promptInput(message, validate);
    }
  }
  return result;
}

export async function promptSelect<T extends string>(message: string, options: { label: string; value: T }[]): Promise<T> {
  const result = await consola.prompt(message, {
    type: "select",
    options,
  });
  if (typeof result === "symbol") {
    process.exit(0);
  }
  return result as T;
}
