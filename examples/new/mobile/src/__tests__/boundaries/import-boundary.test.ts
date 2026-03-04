import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(__dirname, '../../..');

function collectSourceFiles(rootDir: string, files: string[] = []) {
  for (const entry of readdirSync(rootDir)) {
    if (entry === '__tests__') {
      continue;
    }

    const absolute = path.join(rootDir, entry);
    const stats = statSync(absolute);

    if (stats.isDirectory()) {
      collectSourceFiles(absolute, files);
      continue;
    }

    if (absolute.endsWith('.ts') || absolute.endsWith('.tsx')) {
      files.push(absolute);
    }
  }

  return files;
}

describe('app/src/templates import boundary', () => {
  it('prevents runtime app/src files from importing template blueprints', () => {
    const files = [
      ...collectSourceFiles(path.join(projectRoot, 'app')),
      ...collectSourceFiles(path.join(projectRoot, 'src')),
    ];

    for (const file of files) {
      const content = readFileSync(file, 'utf8');
      expect(content).not.toMatch(/from ['"](?:\.\.\/)+templates\//);
      expect(content).not.toMatch(/require\(['"](?:\.\.\/)+templates\//);
    }
  });
});
