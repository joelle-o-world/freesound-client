import { download as nodeDownload } from "../node-download";
import { play as nodePlay } from "../play";

export async function play(argv: string[]) {
  const savePath = await nodeDownload(argv[0]);
  console.log("Now playing", savePath);
  await nodePlay(savePath);
}
