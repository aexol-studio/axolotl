import { readFileSync, writeFileSync } from 'fs';
import { FieldType, Options, Parser, ParserField, TypeDefinition, getTypeName } from 'graphql-js-tree';

const TAB = (n: number) =>
  new Array(n)
    .fill(1)
    .map(() => '  ')
    .join('');

const toTsType = (t: string) => {
  if (t === 'String') return 'string';
  if (t === 'Int') return 'number';
  if (t === 'Float') return 'number';
  if (t === 'ID') return 'unknown';
  if (t === 'Boolean') return 'boolean';
  return t;
};

export const resolveFieldType = (
  name: string,
  fType: FieldType,
  fn: (str: string) => string = (x) => x,
  isRequired = false,
): string => {
  if (fType.type === Options.name) {
    return fn(isRequired ? name : `${name} | undefined`);
  }
  if (fType.type === Options.array) {
    return resolveFieldType(
      name,
      fType.nest,
      isRequired ? (x) => `Array<${fn(x)}>` : (x) => `Array<${fn(x)}> | undefined`,
      false,
    );
  }
  if (fType.type === Options.required) {
    return resolveFieldType(name, fType.nest, fn, true);
  }
  throw new Error('Invalid field type');
};

export const resolveField = (f: ParserField): string => {
  const isNullType = (type: string): string => {
    return f.type.fieldType.type === Options.required ? `: ${type}` : `?: ${type}`;
  };
  return `${TAB(1)}${f.name}${isNullType(resolveFieldType(toTsType(getTypeName(f.type.fieldType)), f.type.fieldType))}`;
};

const buildArgs = (args: ParserField[]) => {
  if (args.length === 0) return 'never;';
  const inputFields = args.map((a) => `${TAB(3)}${resolveField(a)};`);
  return `{\n${inputFields.join('\n')}\n${TAB(3)}};`;
};

const buildEnumArgs = (args: ParserField[]) => {
  if (args.length === 0) return 'never';
  const inputFields = args.map((a) => `${TAB(1)}${a.name} = "${a.name}"`);
  return `{\n${inputFields.join(',\n')}\n}`;
};

export const generateModels = ({
  schemaPath = './schema.graphql',
  modelsPath = './models.ts',
}: {
  schemaPath: string;
  modelsPath: string;
}) => {
  const fileContent = readFileSync(schemaPath, 'utf8');
  const { nodes } = Parser.parse(fileContent);

  const scalars = nodes.filter((n) => n.data.type === TypeDefinition.ScalarTypeDefinition);
  const scalarsString = scalars.map((s) => `export type ${s.name} = unknown`).join('\n');

  const enums = nodes.filter((n) => n.data.type === TypeDefinition.EnumTypeDefinition);
  const enumsString = enums.map((s) => `export enum ${s.name} ${buildEnumArgs(s.args)}`).join('\n');

  const inputs = nodes.filter((n) => n.data.type === TypeDefinition.InputObjectTypeDefinition);
  const inputsString = inputs
    .map((i) => {
      const inputFields = i.args.map((a) => `${resolveField(a)};`);
      return `export interface ${i.name} {\n${inputFields.join('\n')}\n}`;
    })
    .join('\n');

  const types = nodes.filter((n) => n.data.type === TypeDefinition.ObjectTypeDefinition);
  const typesString = types
    .map((t) => {
      const typeFields = t.args.map((a) => {
        return `${TAB(2)}${a.name}: {\n${TAB(3)}args: ${buildArgs(a.args)}\n${TAB(2)}};`;
      });
      return `${TAB(1)}['${t.name}']: {\n${typeFields.join('\n')}\n${TAB(1)}};`;
    })
    .join('\n');

  const typesFullString = `export type Models = {\n${typesString}\n};\n`;

  const modelsString = [scalarsString, enumsString, inputsString, typesFullString].filter(Boolean).join('\n\n');
  writeFileSync(modelsPath, modelsString);
};