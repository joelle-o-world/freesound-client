#! /usr/local/bin/node

import { login } from "./connect";
import YAML from "yaml";
import { RCFile } from "./rw-rc";
import { resolve } from "path";
import { createWriteStream, existsSync } from "fs";
import createPlayer from "play-sound";

const command = process.argv[2];

const rcfile = new RCFile("freesound");

(async function main() {
  const freesound = await login();

  async function download(soundId: string) {
    const { type, stream } = await freesound.download(soundId);

    const saveDir = await rcfile.askAndStore("saveLocation");
    const filename = `${soundId}.${type}`;
    const savePath = resolve(saveDir, filename);

    if (!existsSync(savePath)) {
      const writer = createWriteStream(savePath);
      stream.pipe(writer);
      await new Promise<void>((fulfil, reject) => {
        writer.on("close", () => fulfil());
        writer.on("error", (err) => reject(err));
      });
    }

    return savePath;
  }

  const subArgs = process.argv.slice(3);
  switch (command) {
    case "whoami":
      console.log(YAML.stringify((await freesound.me()).username));
      break;

    case "my-sounds":
      console.log(YAML.stringify(await freesound.mySounds()));
      break;

    case "search":
      // TODO: Output as a string
      let limit = 20;
      for await (const result of freesound.search(subArgs[0])) {
        console.log(`${result.id} - ${result.name}`);
        if (--limit == 0) break;
      }
      break;

    case "info":
      const response = await freesound.soundInfo(subArgs[0]);
      console.log(YAML.stringify(response));
      break;

    case "uri":
      const downloadLink = await freesound.downloadLink(subArgs[0]);
      console.log(downloadLink);
      break;

    case "download":
      console.log(await download(subArgs[0]));

      break;

    case "play":
      const savePath = await download(subArgs[0]);
      const player = createPlayer();
      player.play(savePath, (err) => {
        console.log("done!");
      });
      break;

    default:
      console.log("Unexpected command:", command);
  }
})();
