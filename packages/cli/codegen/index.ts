import { Command } from "commander";
import chalk from "chalk";
import { createResolverFile } from "./utils.js";

export const createResolversConfig = (program: Command) => {
  program
    .command("resolver")
    .argument("[dir]")
    .description(`${chalk.greenBright("Axolotl Codegen")} - resolvers creator`)
    .action(createResolverFile);
};
