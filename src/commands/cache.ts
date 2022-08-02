import { Command } from "commander";
import { askQuestion } from "../askQuestion";
import { rcfile } from "../config";
import fs from "fs/promises";
import open from "open";

const wipeDownloads = new Command("wipe")
  .description("Wipe the freesound cli downloads directory")
  .action(async () => {
    const saveDir = await rcfile.askAndStore("saveLocation");
    const answer = await askQuestion(
      `Are you sure you want to wipe '${saveDir}'? (yes|no): `
    );
    if (/^y|yes$/.test(answer)) {
      await fs.rmdir(saveDir, { recursive: true });
      await fs.mkdir(saveDir);
    } else console.error("Cancelled.");
  });

const cacheLocation = new Command()
  .name("location")
  .alias("where")
  .description("Where is my freesound cli downloads directory?")
  .action(async () => {
    console.log(await rcfile.askAndStore("saveLocation"));
  });

const openCache = new Command()
  .name("open")
  .description("Open the downloads directory in your native file manager")
  .action(async () => {
    const saveDir = await rcfile.askAndStore("saveLocation");
    open(saveDir);
  });

export const cache = new Command("cache")
  .description("Manage freesound samples cached on your local machine")
  .addCommand(cacheLocation)
  .addCommand(openCache)
  .addCommand(wipeDownloads);
