import { login } from "../connect";
import YAML from "yaml";
import path, { basename, resolve } from "path";
import { createReadStream } from "fs";
import all from "it-all";
import { download as nodeDownload } from "../node-download";
import { play as nodePlay } from "../play";

export async function whoami() {
  console.log(YAML.stringify((await (await login()).me()).username));
}

export async function mySounds() {
  console.log(YAML.stringify(await all((await login()).mySounds())));
}

export async function search(argv: string[]) {
  // TODO: Output as a string
  let limit = 20;
  for await (const result of (await login()).search(argv[0])) {
    console.log(`${result.id} - ${result.name}`);
    if (--limit == 0) break;
  }
}

export async function info(argv: string[]) {
  const response = await (await login()).soundInfo(argv[0]);
  console.log(YAML.stringify(response));
}

export async function uri(argv: string[]) {
  const downloadLink = await (await login()).downloadLink(argv[0]);
  console.log(downloadLink);
}

export async function download(argv: string[]) {
  console.log(await nodeDownload(argv[0]));
  // TODO: --no-cache flag to disable caching downloads
}

export async function play(argv: string[]) {
  const savePath = await nodeDownload(argv[0]);
  console.log("Now playing", savePath);
  await nodePlay(savePath);
}

export async function searchAndPlay(argv: string[]) {
  for await (const result of (await login()).search(argv[0])) {
    console.log(`${result.id} -> ${result.name}`);
    console.log("\tDownloading...");
    const file = await nodeDownload(result.id);
    console.log("\tPlaying...");
    await nodePlay(file);
  }
}

export async function upload(argv: string[]) {
  const [...files] = argv;
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
}
