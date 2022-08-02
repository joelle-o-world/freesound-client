import { Command } from "commander";
import { play } from "./play";
import { download } from "./download";
import { download as nodeDownload } from "../node-download";
import open from "open";

export const openSound = new Command()
  .name("open")
  .description("Open a sound in the default application")
  .argument("<sound-id>", "The ID of the sound you wish to open")
  .action(async (soundId) => {
    const soundPath = await nodeDownload(soundId);
    open(soundPath);
  });

export const sound = new Command()
  .name("sound")
  .description("Commands about sounds")
  .addCommand(play)
  .addCommand(download)
  .addCommand(openSound);
