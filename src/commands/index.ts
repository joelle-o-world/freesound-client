import { Command } from "commander";
import { searchAndPlay } from "./searchAndPlay";
import { my, whoami, pending } from "./whoami";
import { search } from "./search";
import { download } from "./download";
import { upload } from "./upload";
import { pack } from "./packInfo";
import { play } from "./play";
import { info, uri } from "./sound-info";
import { cache } from "./cache";
import { sound } from "./sound";

export const program = new Command()
  .addCommand(whoami)
  .addCommand(sound)
  .addCommand(my)
  .addCommand(search)
  .addCommand(searchAndPlay)
  .addCommand(info)
  .addCommand(uri)
  .addCommand(download)
  .addCommand(upload)
  .addCommand(pack)
  .addCommand(play)
  .addCommand(cache)
  .addCommand(pending);
