import { download as nodeDownload } from "../node-download";

export async function download(argv: string[]) {
  console.log(await nodeDownload(argv[0]));
  // TODO: --no-cache flag to disable caching downloads
}
