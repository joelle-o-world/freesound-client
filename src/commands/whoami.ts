import { login } from "../connect";
import YAML from "yaml";
import all from "it-all";

export async function whoami() {
  console.log(YAML.stringify((await (await login()).me()).username));
}

export async function mySounds() {
  console.log(YAML.stringify(await all((await login()).mySounds())));
}
