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
  const paths = [
    path.join(process.cwd(), 'packages'),
    path.join(process.cwd(), 'modularium'),
    path.join(process.cwd(), 'adapters'),
    path.join(process.cwd(), 'examples'),
  ];
  const dirs = await Promise.all(paths.map(async (root) => ({ root, dir: await fs.readdir(root) })));
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
};

remapPackages();

type PackageJSON = {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};
