import path from "path";

export function parseCommaSeparated(str: string | undefined) {
  if (typeof str === "string") {
    return str.split(/[,\s]+/);
  } else return [];
}

/**
 * Freesound imposes a minimum of 3 tags for every sound. This function tops
 * the tags up if there are not enough.
 */
export function topUpTags(tags: string[]) {
  const minimumTags = 3;

  const lastDitchTags = ["unlabeled", "unknown", "untitled"];
  while (lastDitchTags.length > 0 && tags.length < minimumTags)
    tags = [...tags, lastDitchTags.shift() as string];

  return tags;
}

function isAnInterestingTag(tag: string) {
  return tag.length > 1;
}

export function filenameTags(filename: string) {
  return path.parse(filename).name.split(/\W+/).filter(isAnInterestingTag);
}
