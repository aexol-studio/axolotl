import * as fs from "node:fs";

export const createResolverFile = (dir?: string) => {
  if (!dir || !dir.length || dir === "") {
    console.error("dir cannot be empty");
    return;
  }
  const resolverfile = [
    `import { createResolvers } from '@/src/axolotl.js'`,
    "",
    `export default createResolvers({`,
    `// put your logic here`,
    `});`,
  ];

  fs.writeFileSync(
    dir,
    resolverfile.reduce((pv, cv) => (pv += cv + "\n"), ""),
  );
  console.log(`Resolver file generated`);
};
