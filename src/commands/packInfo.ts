import { login } from "../connect";
import YAML from "yaml";

export async function pack(argv: string[]) {
  const freesound = await login();
  const response = await freesound.packInfo(argv[0]);
  console.log(YAML.stringify(response.data));
}

export async function packList(argv: string[]) {
  const packInfo = argv[0];
  const freesound = await login();
  const sounds = freesound.listSoundsInPack(packInfo);
  for await (const sound of sounds) console.log(`${sound.id} - ${sound.name}`);
}
