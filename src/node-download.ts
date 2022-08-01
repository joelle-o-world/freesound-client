import { login } from "./connect";
import { resolve } from "path";
import { createWriteStream } from "fs";
import glob from "glob-promise";
import { rcfile } from "./config";

/**
 * Download a file from freesound to the filesystem.
 * Only works in a node environment.
 */
export async function download(soundId: string) {
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
