import { login } from "../connect";
import { download as nodeDownload } from "../node-download";
import { play as nodePlay } from "../play";

export async function searchAndPlay(argv: string[]) {
  for await (const result of (await login()).search(argv[0])) {
    console.log(`${result.id} -> ${result.name}`);
    console.log("\tDownloading...");
    const file = await nodeDownload(result.id);
    console.log("\tPlaying...");
    await nodePlay(file);
  }
}
