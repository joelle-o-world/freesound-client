import { login } from "../connect";
import YAML from "yaml";
import { Command } from "commander";
import { download } from "../node-download";

const packList = new Command()
  .name("list")
  .description("List all the sounds in a sample pack")
  .argument("<pack-id>")
  .action(async (packId) => {
    const packInfo = packId;
    const freesound = await login();
    const sounds = freesound.listSoundsInPack(packInfo);
    for await (const sound of sounds)
      console.log(`${sound.id} - ${sound.name}`);
  });

const packInfo = new Command()
  .name("info")
  .argument("<pack-id>")
  .description("Get metadata about a sample pack")
  .action(async (packId) => {
    const freesound = await login();
    const response = await freesound.packInfo(packId);
    console.log(YAML.stringify(response.data));
  });

const downloadPack = new Command()
  .name("download")
  .description("Download a sample pack")
  .argument("<pack-id>", "The id of the pack you want to download")
  .action(async (packId) => {
    const freesound = await login();
    for await (const sound of freesound.listSoundsInPack(packId)) {
      const savePath = await download(sound.id);
      console.log(savePath);
    }
  });

export const pack = new Command("pack")
  .addCommand(packList)
  .addCommand(packInfo)
  .addCommand(downloadPack);
