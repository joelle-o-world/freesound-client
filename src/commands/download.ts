import { Command } from "commander";
import { download as nodeDownload } from "../node-download";
import fs from "fs/promises";
import { extname } from "path";

// TODO: --no-cache flag to disable caching downloads

export const download = new Command()
  .name("download")
  .argument("<sound-id>", "ID of the sound to play")
  .option("-o <output-file>")
  .description("Download a sample")
  .action(async (soundId, options) => {
    if (options.o) {
      const cachedPath = await nodeDownload(soundId);
      if (extname(cachedPath) !== extname(options.o))
        console.warn(`File extension does not match!`);
      await fs.copyFile(cachedPath, options.o);
    } else {
      console.log(await nodeDownload(soundId));
    }
  });
