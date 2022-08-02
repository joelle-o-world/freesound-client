import { login } from "../connect";
import path, { basename, resolve } from "path";
import { createReadStream } from "fs";
import { Command } from "commander";

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

function parseCommaSeparated(str: string | undefined) {
  if (typeof str === "string") {
    return str.split(/[,\s]+/);
  } else return [];
}

/**
 * Freesound imposes a minimum of 3 tags for every sound. This function tops
 * the tags up if there are not enough.
 */
function topUpTags(tags: string[]) {
  const minimumTags = 3;

  const lastDitchTags = ["unlabeled", "unknown", "untitled"];
  while (lastDitchTags.length > 0 && tags.length < minimumTags)
    tags = [...tags, lastDitchTags.shift() as string];

  return tags;
}

function isAnInterestingTag(tag: string) {
  return tag.length > 1;
}

function filenameTags(filename: string) {
  return path.parse(filename).name.split(/\W+/).filter(isAnInterestingTag);
}
