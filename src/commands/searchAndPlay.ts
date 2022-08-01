import { Command } from "commander";
import { login } from "../connect";
import { download as nodeDownload } from "../node-download";
import { play as nodePlay } from "../play";

export const searchAndPlay = new Command()
  .name("search-and-play")
  .argument("<query>")
  .action(async (query) => {
    for await (const result of (await login()).search(query)) {
      console.log(`${result.id} -> ${result.name}`);
      console.log("\tDownloading...");
      const file = await nodeDownload(result.id);
      console.log("\tPlaying...");
      await nodePlay(file);
    }
  });
