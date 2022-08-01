let about =
  "Unofficial Freesound CLI\nhttps://github.com/joelyjoel/freesound-client\n";
import * as commands from "./";

export async function help() {
  console.log(about);
  console.log("COMMANDS:");
  for (let command in commands) console.log(`  ${command}`);

  console.log("");
}
