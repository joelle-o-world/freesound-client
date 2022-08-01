import { login } from "../connect";
import path, { basename, resolve } from "path";
import { createReadStream } from "fs";

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
