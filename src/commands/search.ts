import { Command } from "commander";
import { login } from "../connect";

// TODO: Add limit option

export const search = new Command()
  .name("search")
  .argument("<query>")
  .action(async (query) => {
    // TODO: Output as a string
    let limit = 20;
    for await (const result of (await login()).search(query)) {
      console.log(`${result.id} - ${result.name}`);
      if (--limit == 0) break;
    }
  });
