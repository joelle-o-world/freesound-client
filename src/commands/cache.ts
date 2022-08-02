import { Command } from "commander";
import { askQuestion } from "../askQuestion";
import { rcfile } from "../config";
import fs from "fs/promises";

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

export const cache = new Command("cache")
  .description("Manage freesound samples cached on your local machine")
  .addCommand(wipeDownloads);
