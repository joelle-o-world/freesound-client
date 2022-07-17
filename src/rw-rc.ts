import { homedir } from "os";
import { resolve } from "path";
import { readFile, writeFile, existsSync } from "fs";
import { askQuestion } from "./askQuestion";

/**
 * Read and write to RC files
 */
export class RCFile<T extends Record<string, unknown>> {
  public readonly filepath: string;

  readonly parse: (str: string) => T;
  readonly stringify: (config: T) => string;

  constructor(
    packageName: string,
    {
      parse = JSON.parse,
      stringify = (o) => JSON.stringify(o, null, 2),
    }: {
      parse?: (str: string) => any;
      stringify?: (config: any) => string;
    } = {}
  ) {
    this.filepath = resolve(homedir(), `.${packageName}rc`);
    this.parse = parse;
    this.stringify = stringify;
  }

  read(): Promise<T> {
    return new Promise((fulfil, reject) => {
      if (existsSync(this.filepath))
        readFile(this.filepath, { encoding: "utf-8" }, (err, contents) => {
          if (err) reject(err);
          else
            try {
              const config = this.parse(contents);
              fulfil(config);
            } catch (err) {
              reject(err);
            }
        });
      else fulfil({} as T);
    });
  }

  write(config: T): Promise<void> {
    return new Promise((fulfil, reject) => {
      writeFile(this.filepath, this.stringify(config), (err) => {
        if (err) reject(err);
        else fulfil();
      });
    });
  }

  async modify(changes: Partial<T>) {
    this.write({ ...(await this.read()), ...changes });
  }

  async set<Key extends keyof T>(key: Key, value: T[Key]) {
    await this.modify({ [key]: value } as unknown as Partial<T>);
  }

  // TODO: Use typescript to indicate that this must only be used with string fields
  async askAndStore(
    key: string,
    question = `Please enter value for '${key}': `
  ): Promise<string> {
    const config = await this.read();
    if (config[key]) return config[key] as string;
    else {
      const value = await askQuestion(question);
      this.set(key, value as any);
      return value;
    }
  }
}
