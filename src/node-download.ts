import { login } from "./connect";
import { resolve } from "path";
import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import glob from "glob-promise";
import { rcfile } from "./config";

/**
 * Download a file from freesound to the filesystem.
 * Only works in a node environment.
 */
export async function download(soundId: string) {
  const cacheLocation = await rcfile.askAndStore("saveLocation");
  const pattern = `${cacheLocation}/*/${soundId}-*.*`;
  const matches = await glob(pattern);

  if (matches.length) {
    // Already exists
    console.error("(Using cached version)");
    return matches[0];
  } else {
    const { stream, packName, packId, name } = await (
      await login()
    ).download(soundId);
    const filename = `${soundId}-${name}`;
    let saveDir = cacheLocation;
    if (packId) {
      saveDir = resolve(saveDir, `${packId}-${packName}`);
    } else saveDir = resolve(saveDir, "no-pack");

    await mkdir(saveDir, { recursive: true });
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
