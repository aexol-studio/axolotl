import fs from 'node:fs/promises';
import path from 'node:path';
const updateDeps = ({
  dependencies,
  depsList,
  version,
}: {
  dependencies: PackageJSON['dependencies'];
  depsList: string[];
  version: string;
}) => {
  return Object.fromEntries(
    Object.entries(dependencies || {}).map(([depName, depVersion]) => {
      if (!depsList.includes(depName)) return [depName, depVersion];
      return [depName, `^${version}`];
    }),
  );
};
const changePackageVersion = (version: string, depsList: string[]) => (packageJSON: PackageJSON) => {
  return {
    ...packageJSON,
    version,
    dependencies: updateDeps({ dependencies: packageJSON.dependencies, depsList, version }),
    devDependencies: updateDeps({ dependencies: packageJSON.devDependencies, depsList, version }),
    peerDependencies: updateDeps({ dependencies: packageJSON.peerDependencies, depsList, version }),
  } satisfies PackageJSON;
};

const remapPackages = async () => {
  const mainVersion = await fs.readFile(path.join(process.cwd(), 'package.json'), 'utf-8');
  const mainVersionJSON = JSON.parse(mainVersion) as PackageJSON;
  const roots = ['packages', 'adapters', 'examples'] as const;
  const dirs = await Promise.all(
    roots.map(async (relative) => {
      const root = path.join(process.cwd(), relative);
      try {
        const dir = await fs.readdir(root);
        return { root, dir };
      } catch (error) {
        const err = error as NodeJS.ErrnoException;
        if (err.code === 'ENOENT') {
          return { root, dir: [] };
        }
        throw err;
      }
    }),
  );
  const allJsons = await Promise.all(
    dirs.map(async ({ dir, root }) => {
      const all = await Promise.all(
        dir.map(async (p) => {
          const packagePath = path.join(root, p, 'package.json');
          const packageJSONString = await fs.readFile(packagePath, 'utf-8');
          const packageJSON = JSON.parse(packageJSONString) as PackageJSON;
          return { packageJSON, packagePath };
        }),
      );
      return all;
    }),
  );
  const allPackageJsons = allJsons.reduce((a, b) => {
    return [...a, ...b];
  }, []);

  const depsList = allPackageJsons.map((p) => p.packageJSON.name);
  const changeVersion = changePackageVersion(mainVersionJSON.version, depsList);
  for (const { packagePath, packageJSON } of allPackageJsons) {
    await fs.writeFile(packagePath, JSON.stringify(changeVersion(packageJSON), null, 2));
    console.log(
      `Updated "${packageJSON.name}" from "${packageJSON.version}" to "${mainVersionJSON.version}" and it's internal dependencies`,
    );
  }

  // Sync docs package.json version
  const docsPackagePath = path.join(process.cwd(), 'docs', 'package.json');
  try {
    const docsPackageString = await fs.readFile(docsPackagePath, 'utf-8');
    const docsPackageJSON = JSON.parse(docsPackageString) as PackageJSON;
    if (docsPackageJSON.version !== mainVersionJSON.version) {
      docsPackageJSON.version = mainVersionJSON.version;
      await fs.writeFile(docsPackagePath, JSON.stringify(docsPackageJSON, null, 2) + '\n');
      console.log(`Updated docs version to "${mainVersionJSON.version}"`);
    }
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== 'ENOENT') {
      throw err;
    }
    console.warn('docs/package.json not found, skipping version sync');
  }
};

remapPackages();

type PackageJSON = {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};
