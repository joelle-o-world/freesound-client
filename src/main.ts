#! /usr/local/bin/node

let about =
  "Unofficial Freesound CLI\nhttps://github.com/joelyjoel/freesound-client";

import * as commands from "./commands";

(async function main() {
  const command = process.argv[2];
  const subArgs = process.argv.slice(3);

  if (!command) {
    console.log(about);
    return 0;
  }

  // @ts-ignore
  const commandImplementation = commands[command];
  if (commandImplementation) {
    const exitCode = await commandImplementation(subArgs);
    process.exit(exitCode);
  } else {
    console.error(`Unexpected command '${command}'`);
    process.exit(1);
  }
})();
