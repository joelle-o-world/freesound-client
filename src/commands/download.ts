import { Command } from "commander";
import { download as nodeDownload } from "../node-download";

// TODO: --no-cache flag to disable caching downloads

export const download = new Command()
  .name("download")
  .argument("<sound-id>", "ID of the sound to play")
  .action(async (soundId) => {
    console.log(await nodeDownload(soundId));
  });
