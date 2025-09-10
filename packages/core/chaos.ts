import { Parser, ParserField, ScalarTypes, TypeDefinition, TypeSystemDefinition, getTypeName, Options } from 'graphql-js-tree';
import { readFileSync } from 'node:fs';
import * as path from 'node:path';

const scalarFieldTypes = [
  ScalarTypes.Boolean,
  ScalarTypes.Float,
  ScalarTypes.ID,
  ScalarTypes.Int,
  ScalarTypes.String,
] as string[];

const findRootNode = (nodes: ParserField[]) => (tName: string) => {
  return nodes.find((n) => n.name === tName);
};

const isRequiredType = (t: any): boolean => {
  if (!t) return false;
  if (t.type === Options.required) return true;
  if (t.nest) return isRequiredType(t.nest);
  return false;
};

const createRng = (seed: number) => {
  // Mulberry32 PRNG
  let s = seed >>> 0;
  return () => {
    s += 0x6D2B79F5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const createRand = (rng: () => number) => ({
  int: (min = 0, max = 1000) => Math.floor(rng() * (max - min + 1)) + min,
  float: () => Math.round(rng() * 1000) / 10,
  bool: () => rng() < 0.5,
  id: () => `id_${Math.floor(rng() * 1e9).toString(36)}`,
  str: (prefix = 's') => `${prefix}_${Math.floor(rng() * 1e9).toString(36)}`,
});

const genLiteralForNamed = (nodes: ParserField[], name: string, rand: ReturnType<typeof createRand>): string | undefined => {
  if (name === ScalarTypes.String) return JSON.stringify(rand.str());
  if (name === ScalarTypes.Int) return String(rand.int());
  if (name === ScalarTypes.Float) return String(rand.float());
  if (name === ScalarTypes.Boolean) return String(rand.bool());
  if (name === ScalarTypes.ID) return JSON.stringify(rand.id());
  const node = nodes.find((n) => n.name === name);
  if (!node) return JSON.stringify(null);
  if (node.data.type === TypeDefinition.EnumTypeDefinition) {
    const vals = node.args.map((a) => a.name);
    if (!vals.length) return undefined;
    const pick = vals[rand.int(0, vals.length - 1)];
    return pick; // enums are bare identifiers
  }
  if (node.data.type === TypeDefinition.InputObjectTypeDefinition) {
    const parts: string[] = [];
    for (const f of node.args) {
      const required = isRequiredType(f.type.fieldType);
      if (!required && rand.bool()) continue;
      const v = genLiteralForFieldType(nodes, f.type.fieldType, rand);
      if (v === undefined) continue;
      parts.push(`${f.name}: ${v}`);
    }
    return `{ ${parts.join(', ')} }`;
  }
  if (node.data.type === TypeDefinition.ScalarTypeDefinition) {
    // Custom scalar – emit a string token
    return JSON.stringify(rand.str('scalar'));
  }
  // For object/interface/union as input (shouldn't happen), fallback
  return JSON.stringify(null);
};

const genLiteralForFieldType = (nodes: ParserField[], t: any, rand: ReturnType<typeof createRand>): string | undefined => {
  if (t.type === Options.name) {
    return genLiteralForNamed(nodes, t.name as string, rand);
  }
  if (t.type === Options.required) return genLiteralForFieldType(nodes, t.nest, rand);
  if (t.type === Options.array) {
    const len = rand.int(1, 2);
    const vals: string[] = [];
    for (let i = 0; i < len; i++) {
      const v = genLiteralForFieldType(nodes, t.nest, rand);
      if (v !== undefined) vals.push(v);
    }
    return `[${vals.join(', ')}]`;
  }
  return undefined;
};

const randomPick = <T>(rng: () => number, arr: T[], count: number) => {
  if (count >= arr.length) return arr;
  const clone = [...arr];
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone.slice(0, count);
};

const buildSelection = (nodes: ParserField[], rand: ReturnType<typeof createRand>, rng: () => number, fragmentsPerType = 2) => {
  const getType = findRootNode(nodes);
  const maxFieldsPerLevel = 3;
  return (n: ParserField, maxDepth: number, currentDepth = 0): string => {
    const candidates = (n.args || []);
    const chosen = randomPick(rng, candidates, Math.min(maxFieldsPerLevel, candidates.length));
    const indent = (lvl: number) => new Array(lvl).fill('  ').join('');
    const inner = chosen
      .map((a) => {
        const tName = getTypeName(a.type.fieldType);
        const node = getType(tName);
        // Build inline arguments if present
        let argsStr = '';
        if (a.args && a.args.length) {
          const argPairs: string[] = [];
          for (const arg of a.args) {
            const required = isRequiredType(arg.type.fieldType);
            if (!required && rand.bool()) continue;
            const v = genLiteralForFieldType(nodes, arg.type.fieldType, rand);
            if (v !== undefined) argPairs.push(`${arg.name}: ${v}`);
          }
          if (argPairs.length) argsStr = `(${argPairs.join(', ')})`;
        }
        // Scalars and enums
        if (scalarFieldTypes.includes(tName)) return `${indent(currentDepth + 1)}${a.name}${argsStr}`;
        if (node?.data.type === TypeDefinition.EnumTypeDefinition) return `${indent(currentDepth + 1)}${a.name}${argsStr}`;
        if (node?.data.type === TypeDefinition.ScalarTypeDefinition) return `${indent(currentDepth + 1)}${a.name}${argsStr}`;
        // Interfaces/unions: build inline fragments
        if (node?.data.type === TypeDefinition.InterfaceTypeDefinition || node?.data.type === TypeDefinition.UnionTypeDefinition) {
          let possible: ParserField[] = [];
          if (node.data.type === TypeDefinition.InterfaceTypeDefinition) {
            possible = nodes.filter(
              (nn) => nn.data.type === TypeDefinition.ObjectTypeDefinition && (nn.interfaces || []).includes(node.name),
            );
          } else {
            possible = (node.args || [])
              .map((u) => getType(u.name))
              .filter((x): x is ParserField => !!x && x.data.type === TypeDefinition.ObjectTypeDefinition);
          }
          if (!possible.length) return `${indent(currentDepth + 1)}${a.name}${argsStr}`;
          const chosenImpls = randomPick(rng, possible, Math.min(fragmentsPerType, possible.length));
          const fragments = chosenImpls
            .map((ptn) => {
              const children = buildSelection(nodes, rand, rng, fragmentsPerType)(ptn, maxDepth, currentDepth + 2);
              const innerFrag = children.trim() ? `\n${children}\n${indent(currentDepth + 2)}` : '';
              return `${indent(currentDepth + 2)}... on ${ptn.name} {${innerFrag}}`;
            })
            .join('\n');
          return `${indent(currentDepth + 1)}${a.name}${argsStr} {\n${fragments}\n${indent(currentDepth + 1)}}`;
        }
        // Objects
        if (node && currentDepth < maxDepth) {
          const children = buildSelection(nodes, rand, rng, fragmentsPerType)(node, maxDepth, currentDepth + 1);
          if (!children.trim()) return `${indent(currentDepth + 1)}${a.name}${argsStr}`;
          return `${indent(currentDepth + 1)}${a.name}${argsStr} {\n${children}\n${indent(currentDepth + 1)}}`;
        }
        return `${indent(currentDepth + 1)}${a.name}${argsStr}`;
      })
      .filter((l): l is string => !!l);
    return inner.join('\n');
  };
};

export const chaos = async (
  serverUrl: string,
  schemaPath = './schema.graphql',
  options: {
    maxDepth?: number;
    tests?: number;
    includeMutations?: boolean;
    headers?: Record<string, string>;
    verbose?: boolean;
    seed?: number;
    fragmentsPerType?: number;
  } = {},
) => {
  const cfg = {
    maxDepth: 2,
    tests: 10,
    includeMutations: false,
    headers: {},
    verbose: false,
    seed: undefined as number | undefined,
    fragmentsPerType: 2,
    ...options,
  };
  const rng = createRng(typeof cfg.seed === 'number' ? cfg.seed : Math.floor(Date.now() % 2147483647));
  const rand = createRand(rng);
  const fileContent = readFileSync(path.join(process.cwd(), schemaPath), 'utf8');
  const { nodes } = Parser.parse(fileContent);
  const schemaNode = nodes.find((n) => n.data.type === TypeSystemDefinition.SchemaDefinition);

  const queryNodeArg = schemaNode?.args.find((a) => a.name === 'query');
  const queryNodeName = queryNodeArg && getTypeName(queryNodeArg?.type.fieldType);
  const queryNode = (queryNodeName && nodes.find((n) => n.name === queryNodeName)) || undefined;

  const mutationNodeArg = schemaNode?.args.find((a) => a.name === 'mutation');
  const mutationNodeName = mutationNodeArg && getTypeName(mutationNodeArg?.type.fieldType);
  const mutationNode = (mutationNodeName && nodes.find((n) => n.name === mutationNodeName)) || undefined;

  if (!queryNode && !mutationNode) {
    console.log('No query/mutation root types found.');
    return;
  }
  const build = buildSelection(nodes, rand, rng, cfg.fragmentsPerType);

  let success = 0;
  const errors: Array<{ query: string; error: any }> = [];

  const runOnce = async (op: 'query' | 'mutation') => {
    const root = op === 'query' ? queryNode : mutationNode;
    if (!root) return;
    const selection = build(root, cfg.maxDepth);
    if (!selection.trim()) return;
    const q = `${op} {\n${selection}\n}`;
    if (cfg.verbose) {
      console.log(`\n--- CHAOS ${op.toUpperCase()} ---\n${q}\n`);
    }
    try {
      const res = await fetch(serverUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...(cfg.headers || {}) },
        body: JSON.stringify({ query: q }),
      });
      const json = await res.json().catch(async () => ({ text: await res.text().catch(() => '') }));
      if (res.ok && (json as any).data && !(json as any).errors) {
        success += 1;
      } else {
        errors.push({ query: q, error: (json as any).errors || (json as any) });
      }
    } catch (e) {
      errors.push({ query: q, error: e });
    }
  };

  for (let i = 0; i < cfg.tests; i++) {
    await runOnce('query');
    if (cfg.includeMutations) await runOnce('mutation');
  }

  console.log(`Chaos finished. Successes: ${success}, Failures: ${errors.length}`);
  if (errors.length && cfg.verbose) {
    console.log('\nSample errors:');
    errors.slice(0, 3).forEach((e, idx) => {
      console.log(`\n[${idx + 1}] Query:\n${e.query}\nError:\n${JSON.stringify(e.error, null, 2)}`);
    });
  }
};
