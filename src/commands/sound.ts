import { Command } from "commander";
import { play } from "./play";
import { download } from "./download";

export const sound = new Command()
  .name("sound")
  .description("Commands about sounds")
  .addCommand(play)
  .addCommand(download);
