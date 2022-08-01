#! /usr/local/bin/node

import { login } from "./connect";
import YAML from "yaml";
import { RCFile } from "./rw-rc";
import path, { basename, resolve } from "path";
import { createReadStream, createWriteStream } from "fs";
import createPlayer from "play-sound";
import all from "it-all";
import glob from "glob-promise";

const command = process.argv[2];

const rcfile = new RCFile("freesound");

(async function main() {
  async function download(soundId: string) {
    const saveDir = await rcfile.askAndStore("saveLocation");
    const pattern = `${resolve(saveDir)}/${soundId}.*`;
    const matches = await glob(pattern);

    if (matches.length) {
      // Already exists
      return matches[0];
    } else {
      const { type, stream } = await (await login()).download(soundId);
      const filename = `${soundId}.${type}`;
      const savePath = resolve(saveDir, filename);
      const writer = createWriteStream(savePath);
      stream.pipe(writer);
      await new Promise<void>((fulfil, reject) => {
        writer.on("close", () => fulfil());
        writer.on("error", (err) => reject(err));
      });

      return savePath;
    }
  }

  let player: ReturnType<typeof createPlayer>;
  async function play(file: string) {
    return new Promise<void>((fulfil, reject) => {
      if (!player) player = createPlayer();
      player.play(file, (err) => {
        if (err) reject(err);
        else fulfil();
      });
    });
  }

  const subArgs = process.argv.slice(3);
  // TODO: Move the command definitions to external module
  switch (command) {
    case "whoami":
      console.log(YAML.stringify((await (await login()).me()).username));
      break;

    case "my-sounds":
      console.log(YAML.stringify(await all((await login()).mySounds())));
      break;

    case "search":
      // TODO: Output as a string
      let limit = 20;
      for await (const result of (await login()).search(subArgs[0])) {
        console.log(`${result.id} - ${result.name}`);
        if (--limit == 0) break;
      }
      break;

    case "info":
      const response = await (await login()).soundInfo(subArgs[0]);
      console.log(YAML.stringify(response));
      break;

    case "uri":
      const downloadLink = await (await login()).downloadLink(subArgs[0]);
      console.log(downloadLink);
      break;

    case "download":
      console.log(await download(subArgs[0]));
      // TODO: --no-cache flag to disable caching downloads
      break;

    case "play":
      const savePath = await download(subArgs[0]);
      console.log("Now playing", savePath);
      await play(savePath);
      break;

    case "search-and-play":
      for await (const result of (await login()).search(subArgs[0])) {
        console.log(`${result.id} -> ${result.name}`);
        console.log("\tDownloading...");
        const file = await download(result.id);
        console.log("\tPlaying...");
        await play(file);
      }
      break;

    case "upload":
      const [...files] = subArgs;
      for (const file of files) {
        const filepath = resolve(file);
        const filename = basename(filepath);
        console.log("Trying to upload", filepath);
        const stream = createReadStream(filepath);
        await (
          await login()
        ).upload(stream, {
          name: filename,
          description: "A sound uploaded with freesound cli",
          tags: [...path.parse(filename).name.split(/\W/)],
        });
      }
      break;

    default:
      console.log("Unexpected command:", command);
  }
})();
