import * as path from 'path';
import chalk, { Color } from 'chalk';
import { BASE_REPOSITORY, MESSAGE_BRAKE } from './consts.js';
import fs from 'fs';
import { execSync } from 'child_process';

type Message = { message: string; color?: typeof Color };

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

  const isFolderExist = fs.existsSync(path);
  const folderErrorMessages = [
    { message: `Folder ${path} already exists.`, color: 'red' as const },
    { message: `Please try again.`, color: 'white' as const },
  ];
  if (isFolderExist) {
    log(folderErrorMessages);
    process.exit(1);
  }

  const installationMessages = [
    {
      message: `Installing starter ${chalk.magenta('GraphQL Axolotl Server')} - GraphQL ${firstLetterToUpperCase(
        starter,
      )} example...`,
    },
    { message: `This may take a while...`, color: 'white' as const },
  ];
  log(installationMessages);
  if (runCommands(path, example, name)) {
    const successMessages = [
      {
        message: `Starter ${chalk.magenta('GraphQL Axolotl Server')} - GraphQL ${firstLetterToUpperCase(
          starter,
        )} example created.`,
      },
      { message: `To run it, type:`, color: 'white' as const },
      {
        message: `cd ${chalk.magenta(`${repo}`)} && ${chalk.magenta(`npm run start`)}`,
        color: 'yellow' as const,
      },
    ];

    log(successMessages);
  } else {
    const errorMessages = [
      { message: `Starter ${chalk.magenta('GraphQL Axolotl Server')} failed.`, color: 'red' as const },
    ];

    log(errorMessages, true);
    process.exit(1);
  }
};

function runCommands(path: string, example: string, name?: string): boolean {
  try {
    const system = checkSystem({ node: '16.20' });
    if (!system) return false;

    if (!isPathValid(path)) return false;

    const clone = runCommand(`git clone -n --depth=1 --filter=tree:0 ${BASE_REPOSITORY} ${path}`);
    if (!clone) return false;

    const checkout = runCommand(
      `cd ${path} && git config core.sparseCheckout true && git sparse-checkout set examples/${example} && git checkout && git config core.sparseCheckout false`,
    );
    if (!checkout) return false;

    let copy;
    if (system.platform === 'win32') {
      copy = runCommand(`cd ${path} && xcopy /E /Y examples\\${example} . && rmdir /S /Q examples`);
    } else copy = runCommand(`cd ${path} && cp -r examples/${example}/* . && rm -rf examples`);
    if (!copy) return false;

    let cleanUpGit;
    if (system.platform === 'win32') {
      cleanUpGit = runCommand(`cd ${path} && rmdir /S /Q .git`);
    } else cleanUpGit = runCommand(`cd ${path} && rm -rf .git`);
    if (!cleanUpGit) return false;

    // init new git - if fails nothing happens we can continue
    runCommand(`cd ${path} && git init --quiet`, false);

    const json = JSON.parse(fs.readFileSync(`${path}/package.json`, 'utf8'));
    const modified = {
      ...json,
      name: name || json.name,
    };
    const updated = JSON.stringify(modified, null, 2);
    if (updated !== JSON.stringify(json, null, 2)) fs.writeFileSync(`${path}/package.json`, updated, 'utf8');

    const install = runCommand(`cd ${path} && npm install`);
    if (!install) return false;

    return true;
  } catch (error) {
    return false;
  }
}

const runCommand = (command: string, withLog = true) => {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (e) {
    if (withLog) {
      log([
        { message: `Command ${command} failed.`, color: 'red' as const },
        { message: `Please try again.`, color: 'white' as const },
      ]);
    }
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
  const node = checkNodeVersion(_node);
  if (!node) return undefined;

  const isWindows = process.platform === 'win32';
  const isMacOS = process.platform === 'darwin';
  const isLinux = process.platform === 'linux';

  if (!isWindows && !isMacOS && !isLinux) {
    const systemErrorMessages = [
      { message: `Unsupported system.`, color: 'red' as const },
      { message: `Please try again.`, color: 'white' as const },
    ];
    log(systemErrorMessages);
    return undefined;
  }
  return {
    platform: process.platform,
    node,
  };
};

const checkNodeVersion = (version: string) => {
  const [_major, _minor] = version.split('.');
  const nodeVersion = process.versions.node;
  const [major, minor] = nodeVersion.split('.');

  if (Number(major) < Number(_major) || (Number(major) === Number(_major) && Number(minor) < Number(_minor))) {
    const nodeErrorMessages = [
      { message: `You need Node.js version ${version} or higher to run this app.`, color: 'red' as const },
      { message: `You are currently running Node.js ${nodeVersion}.`, color: 'red' as const },
    ];
    log(nodeErrorMessages);
    return false;
  }
  return nodeVersion;
};
