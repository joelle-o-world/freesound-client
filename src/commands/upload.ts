import { login } from "../connect";
import path, { basename, resolve } from "path";
import { createReadStream } from "fs";
import { Command } from "commander";

export const upload = new Command()
  .name("upload")
  .argument("<files...>")
  .action(async (files) => {
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
  });
