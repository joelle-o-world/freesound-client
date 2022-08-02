import { login } from "../connect";
import path, { basename, dirname, resolve } from "path";
import { createReadStream } from "fs";
import { Command } from "commander";
import { filenameTags, parseCommaSeparated, topUpTags } from "../tags";
import glob from "glob-promise";

// TODO: --metadata <file> option

export const uploadPack = new Command()
  .name("pack")
  .description("Upload a folder as a sample pack")
  .argument(
    "<folder>",
    "Path to the directory containing the samples of your pack"
  )
  .option(
    "-t|--tags <comma-separated-list>",
    "Comma-separated-list of tags to attach to the uploaded sounds"
  )
  .option(
    "--description <string>",
    "Describe your the sound",
    "A sound uploaded with freesound cli"
  )
  .option("--pack <name>", "The name of the sample pack")
  .action(async (folder, options) => {
    const absolutePath = resolve(folder);
    const folderName = basename(absolutePath);
    const pack = options.pack || folderName;
    const files = await glob(`${absolutePath}/*.wav`);
    // TODO: Check the pack doesn't already exist
    const freesound = await login();
    const tagsFromOptions = parseCommaSeparated(options.tags);
    for (const file of files) {
      const filepath = resolve(file);
      const filename = basename(filepath);
      let tags = [...tagsFromOptions, ...filenameTags(filename)];
      tags = topUpTags(tags);

      const stream = createReadStream(filepath);
      console.log(`Uploading ${filename}`);
      try {
        await freesound.upload(stream, {
          name: filename,
          description: options.description,
          tags,
          pack,
        });
      } catch (err) {
        console.error("There was a problem uploading", filename);
      }
    }
  });

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
  })
  .addCommand(uploadPack);
