import { Command } from "commander";
import { searchAndPlay } from "./searchAndPlay";
import { mySounds, whoami } from "./whoami";
import { search } from "./search";
import { download } from "./download";
import { upload } from "./upload";
import { pack } from "./packInfo";
import { play } from "./play";
import { info, uri } from "./sound-info";

export const program = new Command()
  .addCommand(whoami)
  .addCommand(mySounds)
  .addCommand(search)
  .addCommand(searchAndPlay)
  .addCommand(info)
  .addCommand(uri)
  .addCommand(download)
  .addCommand(upload)
  .addCommand(pack)
  .addCommand(play);
