import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(__dirname, '../../..');
const runtimeRoots = [path.join(projectRoot, 'app'), path.join(projectRoot, 'src')];

const runtimeFileAllowlist = /\.(ts|tsx)$/;
const runtimeFileDenylist = /\.(test|stories)\.tsx?$/;
const bannedRuntimeShadowPattern = /\b(shadowColor|shadowOffset|shadowOpacity|shadowRadius|elevation)\b/;

function collectRuntimeFiles(rootDir: string, files: string[] = []) {
  for (const entry of readdirSync(rootDir)) {
    const absolute = path.join(rootDir, entry);
    const stats = statSync(absolute);

    if (stats.isDirectory()) {
      collectRuntimeFiles(absolute, files);
      continue;
    }

    if (!runtimeFileAllowlist.test(absolute) || runtimeFileDenylist.test(absolute)) {
      continue;
    }

    files.push(absolute);
  }

  return files;
}

describe('runtime shadow guardrail', () => {
  it('blocks legacy shadow props and elevation in runtime scope', () => {
    const files = runtimeRoots.flatMap((root) => collectRuntimeFiles(root));

    for (const file of files) {
      const content = readFileSync(file, 'utf8');
      expect(content).not.toMatch(bannedRuntimeShadowPattern);
    }
  });
});
