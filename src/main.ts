#! /usr/local/bin/node

import { Command } from "commander";
const program = new Command();

import * as commands from "./commands";
for (let name in commands) {
  const implementation = commands[name as keyof typeof commands];
  if (implementation instanceof Command) {
    program.addCommand(implementation);
  } else program.command(name).action(implementation);
}

program.parse();
