import { login } from "../connect";
import path, { basename, resolve } from "path";
import { createReadStream } from "fs";
import { Command } from "commander";
import { filenameTags, parseCommaSeparated, topUpTags } from "../tags";

// TODO: --metadata <file> option

export const upload = new Command()
  .name("upload")
  .argument("<files...>")
  .option(
    "--description <string>",
    "Describe your the sound",
    "A sound uploaded with freesound cli"
  )
  .option("--pack <name>", "The name of the freesound pack to upload into")
  .option(
    "-t|--tags <comma-separated-list>",
    "Comma-separated-list of tags to attach to the uploaded sounds"
  )
  .description("Upload sounds from your computer")
  .action(async (files, options) => {
    const tagsFromOptions = parseCommaSeparated(options.tags);

    for (const file of files) {
      const filepath = resolve(file);
      const filename = basename(filepath);

      let tags = [...tagsFromOptions, ...filenameTags(filename)];
      tags = topUpTags(tags);

      const stream = createReadStream(filepath);
      await (
        await login()
      ).upload(stream, {
        name: filename,
        description: options.description,
        tags,
        pack: options.pack,
      });
    }
  });
