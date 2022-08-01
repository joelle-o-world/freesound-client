import { Command } from "commander";
import { download as nodeDownload } from "../node-download";
import { play as nodePlay } from "../play";

export const play = new Command()
  .name("play")
  .argument("<sound-id>", "ID of the sound to play")
  .action(async (soundId) => {
    const savePath = await nodeDownload(soundId);
    console.log("Now playing", savePath);
    await nodePlay(savePath);
  });
