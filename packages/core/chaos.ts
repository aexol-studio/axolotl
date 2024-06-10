import { Parser, ParserField, ScalarTypes, TypeDefinition, TypeSystemDefinition, getTypeName } from 'graphql-js-tree';
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

const generateFields = (nodes: ParserField[]) => {
  const getType = findRootNode(nodes);
  return (n: ParserField, fieldName: string, maxCurrentDepth: number, currentDepth = 0): string => {
    const tabs =
      currentDepth === 0
        ? '  '
        : new Array(currentDepth + 1)
            .fill(0)
            .map(() => '  ')
            .join('');
    if (currentDepth === maxCurrentDepth) {
      const eligibleFields = n.args.filter((a) => {
        const tName = getTypeName(a.type.fieldType);
        const isScalar = scalarFieldTypes.includes(tName);
        if (isScalar) return true;
        return false;
      });
      return `${fieldName}{\n${eligibleFields.map((a) => a.name).join('\n')}}`;
    } else {
      return `${fieldName}{\n${n.args
        .flatMap((a) => {
          const tName = getTypeName(a.type.fieldType);
          const node = getType(tName);
          if (scalarFieldTypes.includes(tName)) return `${tabs}${a.name}`;
          if (node?.data.type === TypeDefinition.EnumTypeDefinition) return `${tabs}${a.name}`;
          if (node?.data.type === TypeDefinition.ScalarTypeDefinition) return `${tabs}${a.name}`;
          if (node?.data.type === TypeDefinition.InterfaceTypeDefinition) {
            const possibleTypeNodes = nodes.filter((n1) => n1.interfaces.includes(node.name));
            return `{
              ${possibleTypeNodes.map((ptn) => {
                return `... on {\n${generateFields(nodes)(ptn, ptn.name, maxCurrentDepth, currentDepth + 1)}\n}`;
              })}
            }`;
          }
          if (node) return `${tabs}${generateFields(nodes)(node, a.name, maxCurrentDepth, currentDepth + 1)}`;
        })
        .join('\n')}\n${tabs.slice(2)}}`;
    }
  };
};

export const chaos = async (
  serverUrl: string,
  schemaPath = './schema.graphql',
  options = {
    maxDepth: 2,
    tests: 10,
  },
) => {
  const fileContent = readFileSync(path.join(process.cwd(), schemaPath), 'utf8');
  const { nodes } = Parser.parse(fileContent);
  // const types = nodes.filter((n) => n.data.type === TypeDefinition.ObjectTypeDefinition);
  const schemaNode = nodes.find((n) => n.data.type === TypeSystemDefinition.SchemaDefinition);

  const queryNodeArg = schemaNode?.args.find((a) => a.name === 'query');
  const queryNodeName = queryNodeArg && getTypeName(queryNodeArg?.type.fieldType);
  const queryNode = queryNodeName && nodes.find((n) => n.name === queryNodeName);

  const mutationNodeArg = schemaNode?.args.find((a) => a.name === 'mutation');
  const mutationNodeName = mutationNodeArg && getTypeName(mutationNodeArg?.type.fieldType);
  const mutationNode = mutationNodeName && nodes.find((n) => n.name === mutationNodeName);

  if (mutationNode) {
    const mutation = generateFields(nodes)(mutationNode, 'mutation', 2);
    console.log(mutation);
  }
  if (queryNode) {
    const query = generateFields(nodes)(queryNode, 'query', options.maxDepth);
    console.log(query);
  }
  return;
};
