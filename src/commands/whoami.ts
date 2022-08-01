import { login } from "../connect";
import YAML from "yaml";
import all from "it-all";
import { Command } from "commander";

export const whoami = new Command("whoami").action(async () => {
  console.log(YAML.stringify((await (await login()).me()).username));
});

export const mySounds = new Command("my-sounds").action(async () => {
  console.log(YAML.stringify(await all((await login()).mySounds())));
});
