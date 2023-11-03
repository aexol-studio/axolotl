import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';
import chalk, { ColorName } from 'chalk';

import { BASE_REPOSITORY, MESSAGE_BRAKE } from './consts.js';

type Message = { message: string; color?: ColorName };

export const createAppAction = ({
  starter,
  repo,
  example,
  destination: _destination,
}: {
  starter: string;
  repo: string;
  example: string;
  destination?: string;
}) => {
  const destination = _destination ? _destination : './';
  const name = _destination ? '.' : repo;
  const path = correctPath(destination, name);

  const installationMessages = [
    {
      message: `Installing starter ${chalk.magenta('GraphQL Axolotl Server')} - GraphQL ${firstLetterToUpperCase(
        starter,
      )} example...`,
    },
    { message: `This may take a while...`, color: 'white' as const },
  ];
  log(installationMessages);

  const trigger = runCommands(path, example);
  if ('success' in trigger) {
    const successMessages = [
      {
        message: `Starter ${chalk.magenta('GraphQL Axolotl Server')} - GraphQL ${firstLetterToUpperCase(
          starter,
        )} example created.`,
      },
      { message: `To run it, type:`, color: 'white' as const },
      {
        message: `cd ${chalk.magenta(`${path}`)} && ${chalk.magenta(`npm run start`)}`,
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

export const createDockerFile = () => {
  const dockerfileCommands = [
    'FROM node:20 as build',
    'USER node',
    'WORKDIR /home/node',
    'COPY --chown=node:node . .',
    'RUN npm i',
    'RUN npm run build',
    'ENV PORT=8080',
    'CMD ["npm", "run", "start"]',
  ];
  fs.writeFileSync(
    './Dockerfile',
    dockerfileCommands.reduce((pv, cv) => (pv += cv + '\n'), ''),
  );
  const dockerignoreFiles = ['node_modules', 'Dockerfile', 'lib', '.git', '.gitignore', '.graphql-editor.json'];
  fs.writeFileSync(
    `./.dockerignore`,
    dockerignoreFiles.reduce((pv, cv) => (pv += cv + '\n'), ''),
  );
};

function runCommands(path: string, example: string): { error: string } | { success: boolean } {
  try {
    const system = checkSystem({ node: '16.20' });
    if (system.error) return { error: system.error };

    if (fs.existsSync(path)) return { error: 'folder already exists' };
    if (!isPathValid(path)) return { error: 'invalid path' };
    if (!runCommand(`git --version`, false)) return { error: 'git is not installed' };

    const clone = runCommand(`git clone -n --depth=1 --filter=tree:0 ${BASE_REPOSITORY} ${path}`);
    if (!clone) return { error: "can't clone repository" };

    const checkout = runCommand(
      `cd ${path} && git config core.sparseCheckout true && git sparse-checkout set examples/${example} && git checkout && git config core.sparseCheckout false`,
    );
    if (!checkout) return { error: "can't clone repository" };

    let copy;
    if (system.platform === 'win32') {
      copy = runCommand(`cd ${path} && xcopy /E /Y examples\\${example} . && rmdir /S /Q examples`);
    } else copy = runCommand(`cd ${path} && cp -r examples/${example}/* . && rm -rf examples`);
    if (!copy) return { error: "can't clone repository" };

    let cleanUpGit;
    if (system.platform === 'win32') {
      cleanUpGit = runCommand(`cd ${path} && rmdir /S /Q .git`);
    } else cleanUpGit = runCommand(`cd ${path} && rm -rf .git`);
    if (!cleanUpGit) return { error: "can't clone repository" };

    // init new git - if fails nothing happens we can continue
    runCommand(`cd ${path} && git init --quiet`, false);
    if (!runCommand(`cd ${path} && npm install`)) return { error: 'problem with installing dependencies' };

    return { success: true };
  } catch (error) {
    return { error: 'command failed' };
  }
}

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

const firstLetterToUpperCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const correctPath = (destination: string, name: string) => {
  if (destination.startsWith('/')) destination = destination.slice(1);
  if (!destination.startsWith('./')) destination = `./${destination}`;
  return path.posix.join(destination, name);
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

const isPathValid = (path: string) => {
  const isValid = /^(\/?[A-Za-z0-9_-]+)+$/.test(path);
  const pathErrorMessages = [
    { message: `Path ${path} is not valid.`, color: 'red' as const },
    { message: `Please try again.`, color: 'white' as const },
  ];
  if (!isValid) log(pathErrorMessages);
  return isValid;
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
