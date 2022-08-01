import { login } from "../connect";
import YAML from "yaml";

export async function pack(argv: string[]) {
  const freesound = await login();
  const response = await freesound.packInfo(argv[0]);
  console.log(YAML.stringify(response.data));
}
