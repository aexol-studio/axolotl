import * as fs from 'node:fs';
import { execSync } from 'node:child_process';
import chalk, { ColorName } from 'chalk';

import { BASE_REPOSITORY, MESSAGE_BRAKE } from './consts.js';
import { config } from '@aexol/axolotl-config';

type Message = { message: string; color?: ColorName };

export const addModuleAction = async ({ moduleKey }: { moduleKey: string }) => {
  const source = `modularium/root/src/modules/${moduleKey}`;
  const destination = `src/modules/${moduleKey}`;

  const installationMessages = [
    {
      message: `Putting module ${chalk.magenta(moduleKey)} into the modularium`,
    },
    { message: `This may take a while...`, color: 'white' as const },
  ];
  log(installationMessages);

  const trigger = await runCommands(source, destination);
  if ('success' in trigger) {
    const successMessages = [
      {
        message: `Module ${chalk.magenta(moduleKey)} placed in the modularium`,
      },
      { message: `To run it, type:`, color: 'white' as const },
      {
        message: `npm run models`,
        color: 'yellow' as const,
      },
    ];

    log(successMessages);
  } else {
    const errorMessages = [
      { message: `Starter ${chalk.magenta('GraphQL Axolotl Server')} failed.`, color: 'red' as const },
      { message: ``, color: 'white' as const },
      { message: `${chalk.yellow('Reason:')} ${trigger.error}`, color: 'white' as const },
    ];

    log(errorMessages, true);
    process.exit(1);
  }
};

const TEMP_REPO_NAME = 'repo1234';

const runCommands = async (source: string, destination: string) => {
  try {
    const system = checkSystem({ node: '16.20' });
    if (system.error) return { error: system.error };
    if (fs.existsSync(destination)) return { error: 'folder already exists - use: npx modularium update [module]' };
    config.setValue('federation', [
      ...((await config.getValue('federation')) || []),
      {
        models: `${destination}/models.ts`,
        schema: `${destination}/schema.graphql`,
      },
    ]);
    fs.mkdirSync(destination, { recursive: true });
    const clone = runCommand(`git clone -n --depth=1 --filter=tree:0 ${BASE_REPOSITORY} ${TEMP_REPO_NAME}`);
    if (!clone) return { error: "can't clone repository" };

    const checkout = runCommand(
      `cd ${TEMP_REPO_NAME} && git config core.sparseCheckout true && git sparse-checkout set ${source} && git checkout && git config core.sparseCheckout false`,
    );
    if (!checkout) return { error: "can't checkout repository" };
    let move;
    if (system.platform === 'win32') {
      move = runCommand(`move ${TEMP_REPO_NAME}/${source} ${destination} && del ${TEMP_REPO_NAME}`);
    } else move = runCommand(`mv ${TEMP_REPO_NAME}/${source} ${destination} && rm -rf ${TEMP_REPO_NAME}`);
    if (!move) return { error: "can't move repository" };
    // deps should be installed from docs. Later one we can install deps here somehow
    return { success: true };
  } catch (error) {
    return { error: 'command failed ' + (error instanceof Error ? error.message : '') };
  }
};

const runCommand = (command: string, withLog = true) => {
  try {
    const stdio = withLog ? 'inherit' : 'ignore';
    execSync(command, { stdio });
  } catch (e) {
    if (withLog) log([{ message: `Command ${command} failed.`, color: 'red' as const }]);
    return false;
  }
  return true;
};

const log = (messages: Message[], withoutBreak?: boolean) => {
  if (!withoutBreak) {
    console.log(chalk.yellow(MESSAGE_BRAKE));
  } else {
    console.log(`\n`);
  }
  messages.forEach((message) => console.log(chalk[message.color || 'green'](message.message)));

  if (!withoutBreak) {
    console.log(chalk.yellow(MESSAGE_BRAKE));
  } else {
    console.log(`\n`);
  }
};

const checkSystem = ({ node: _node }: { node: string }) => {
  const check = checkNodeVersion(_node);
  if ('error' in check) return { error: check.error };

  const isWindows = process.platform === 'win32';
  const isMacOS = process.platform === 'darwin';
  const isLinux = process.platform === 'linux';

  if (!isWindows && !isMacOS && !isLinux) return { error: 'Unsupported system.' };
  return { platform: process.platform, node: check.nodeVersion };
};

const checkNodeVersion = (version: string) => {
  const [_major, _minor] = version.split('.');
  const nodeVersion = process.versions.node;
  const [major, minor] = nodeVersion.split('.');

  if (Number(major) < Number(_major) || (Number(major) === Number(_major) && Number(minor) < Number(_minor))) {
    return {
      error: `You need Node.js version ${chalk.red(
        version,
      )} or higher to run this app. You are currently running Node.js ${chalk.magenta(nodeVersion)}.`,
    };
  }
  return { nodeVersion };
};
