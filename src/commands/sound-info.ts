import { login } from "../connect";
import YAML from "yaml";

export async function info(argv: string[]) {
  const response = await (await login()).soundInfo(argv[0]);
  console.log(YAML.stringify(response));
}

export async function uri(argv: string[]) {
  const downloadLink = await (await login()).downloadLink(argv[0]);
  console.log(downloadLink);
}
