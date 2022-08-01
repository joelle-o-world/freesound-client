import { login } from "../connect";
import YAML from "yaml";
import { Command } from "commander";

export const pack = new Command()
  .name("pack")
  .argument("<pack-id>")
  .description("Get metadata about a sample pack")
  .action(async (packId) => {
    const freesound = await login();
    const response = await freesound.packInfo(packId);
    console.log(YAML.stringify(response.data));
  });

export const packList = new Command()
  .name("pack-list")
  .description("List all the sounds in a sample pack")
  .argument("<pack-id>")
  .action(async (packId) => {
    const packInfo = packId;
    const freesound = await login();
    const sounds = freesound.listSoundsInPack(packInfo);
    for await (const sound of sounds)
      console.log(`${sound.id} - ${sound.name}`);
  });
