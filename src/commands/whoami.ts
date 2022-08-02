import { login } from "../connect";
import YAML from "yaml";
import all from "it-all";
import { Command } from "commander";

export const whoami = new Command("whoami")
  .description("Get the username of the currently logged in freesound user")
  .action(async () => {
    console.log(YAML.stringify((await (await login()).me()).username));
  });

export const sounds = new Command("sounds")
  .description("List your own uploaded freesound samples")
  .action(async () => {
    console.log(YAML.stringify(await all((await login()).mySounds())));
  });

const username = new Command("username")
  .description("Get the username of the currently logged in freesound user")
  .action(async () => {
    console.log(YAML.stringify((await (await login()).me()).username));
  });

export const my = new Command("my")
  .addCommand(sounds)
  .addCommand(whoami)
  .addCommand(username);

export const pending = new Command("pending")
  .description("Fetch a list of your pending uploads")
  .action(async () => {
    const freesound = await login();
    const { pending_description, pending_moderation, pending_processing } =
      await freesound.pendingUploads();

    for (const sound of [
      ...pending_description,
      ...pending_processing,
      ...pending_moderation,
    ])
      console.log(sound.id, "-", sound.name);
  });
