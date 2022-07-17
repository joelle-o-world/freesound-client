#! /usr/local/bin/ts-node

import { login } from "./connect";
import YAML from "yaml";
import { RCFile } from "./rw-rc";
import { resolve } from "path";
import { createWriteStream } from "fs";

const command = process.argv[2];

const rcfile = new RCFile("freesound");

(async function main() {
  const freesound = await login();

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
      for await (const result of freesound.search(subArgs[0])) {
        console.log(result);
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
      const { suggestedFilename, stream } = await freesound.download(
        subArgs[0]
      );
      const saveDir = await rcfile.askAndStore("saveLocation");
      const savePath = resolve(saveDir, suggestedFilename);
      const writer = createWriteStream(savePath);
      stream.pipe(writer);

      console.log(savePath);

      break;

    default:
      console.log("Unexpected command:", command);
  }
})();
