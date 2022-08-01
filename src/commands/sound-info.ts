import { login } from "../connect";
import YAML from "yaml";
import { Command } from "commander";

export const info = new Command()
  .name("info")
  .description("Fetch basic metadata about a sound")
  .argument("<sound-id>", "ID of the sound to play")
  .action(async (soundId) => {
    const response = await (await login()).soundInfo(soundId);
    console.log(YAML.stringify(response));
  });

export const uri = new Command()
  .name("uri")
  .description("Get the download link for the given sound")
  .argument("<sound-id>", "ID of the sound to play")
  .action(async (soundId) => {
    const downloadLink = await (await login()).downloadLink(soundId);
    console.log(downloadLink);
  });
