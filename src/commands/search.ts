import { Command } from "commander";
import { login } from "../connect";

// TODO: Add limit option

export const search = new Command()
  .name("search")
  .description("Search the freesound sample database")
  .option("--limit <number>", "limit the number of search results", "20")
  .argument("<query>")
  .action(async (query, options) => {
    // TODO: Output as a string

    let limit: number = Number(options.limit);
    for await (const result of (await login()).search(query)) {
      console.log(`${result.id} - ${result.name}`);
      if (--limit == 0) break;
    }
  });
