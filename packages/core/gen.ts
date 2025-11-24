import { readFileSync, writeFileSync } from 'node:fs';
import {
  FieldType,
  Options,
  Parser,
  ParserField,
  TypeDefinition,
  TypeSystemDefinition,
  getTypeName,
} from 'graphql-js-tree';

const TAB = (n: number) =>
  new Array(n)
    .fill(1)
    .map(() => '  ')
    .join('');

const toTsType = (t: string, scalarNames: string[] = []) => {
  if (t === 'String') return 'string';
  if (t === 'Int') return 'number';
  if (t === 'Float') return 'number';
  if (t === 'ID') return scalarNames.includes('ID') ? "S['ID']" : 'unknown';
  if (t === 'Boolean') return 'boolean';
  return scalarNames.includes(t) ? `S['${t}']` : t;
};

export const resolveFieldType = (
  name: string,
  fType: FieldType,
  fn: (str: string) => string = (x) => x,
  isRequired = false,
): string => {
  if (fType.type === Options.name) {
    return fn(isRequired ? name : `${name} | undefined | null`);
  }
  if (fType.type === Options.array) {
    return resolveFieldType(
      name,
      fType.nest,
      isRequired ? (x) => `Array<${fn(x)}>` : (x) => `Array<${fn(x)}> | undefined | null`,
      false,
    );
  }
  if (fType.type === Options.required) {
    return resolveFieldType(name, fType.nest, fn, true);
  }
  throw new Error('Invalid field type');
};

export const resolveField = (f: ParserField, scalarNames: string[] = []): string => {
  const isNullType = (type: string): string => {
    return f.type.fieldType.type === Options.required ? `: ${type}` : `?: ${type}`;
  };
  return `${TAB(1)}${f.name}${isNullType(resolveFieldType(toTsType(getTypeName(f.type.fieldType), scalarNames), f.type.fieldType))}`;
};

const NeverRecord = `Record<string, never>`;

const buildArgs = (args: ParserField[], scalarNames: string[] = []) => {
  if (args.length === 0) return `${NeverRecord};`;
  const inputFields = args.map((a) => `${TAB(3)}${resolveField(a, scalarNames)};`);
  return `{\n${inputFields.join('\n')}\n${TAB(3)}};`;
};

const buildEnumArgs = (args: ParserField[]) => {
  if (args.length === 0) return NeverRecord;
  const inputFields = args.map((a) => `${TAB(1)}${a.name} = '${a.name}',`);
  return `{\n${inputFields.join('\n')}\n}`;
};

const generateModelsString = (fileContent: string) => {
  const { nodes } = Parser.parse(fileContent);

  const scalars = nodes.filter((n) => n.data.type === TypeDefinition.ScalarTypeDefinition);
  const scalarNames = ['ID', ...scalars.map((s) => s.name)];
  const scalarsString = scalars.map((s) => `export type ${s.name} = unknown;`).join('\n');

  const scalarsFullString = scalars.length
    ? `export type Scalars = {\n${TAB(1)}['ID']: unknown;\n${scalars.map((s) => `${TAB(1)}['${s.name}']: unknown;`).join('\n')}\n};`
    : `export type Scalars = {\n${TAB(1)}['ID']: unknown;\n};`;

  const enums = nodes.filter((n) => n.data.type === TypeDefinition.EnumTypeDefinition);
  const enumsString = enums.map((s) => `export enum ${s.name} ${buildEnumArgs(s.args)}`).join('\n');

  const inputs = nodes.filter((n) => n.data.type === TypeDefinition.InputObjectTypeDefinition);
  const inputsString = inputs
    .map((i) => {
      const inputFields = i.args.map((a) => `${resolveField(a, scalarNames)};`);
      return `export interface ${i.name}<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {\n${inputFields.join('\n')}\n}`;
    })
    .join('\n');

  const unions = nodes.filter((n) => n.data.type === TypeDefinition.UnionTypeDefinition);
  const unionsString = unions
    .map((i) => {
      return `export type ${i.name}<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> = ${i.args.map((a) => a.name).join(' | ')};`;
    })
    .join('\n');

  const interfaces = nodes.filter((n) => n.data.type === TypeDefinition.InterfaceTypeDefinition);
  const interfacesString = interfaces
    .map((i) => {
      const interfaceFields = i.args.map((a) => `${resolveField(a, scalarNames)};`);
      return `export interface ${i.name}<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {\n${interfaceFields.join('\n')}\n}`;
    })
    .join('\n');

  const types = nodes.filter((n) => n.data.type === TypeDefinition.ObjectTypeDefinition);
  const typesString = types
    .map((t) => {
      const typeFields = t.args.map((a) => {
        return `${TAB(2)}${a.name}: {\n${TAB(3)}args: ${buildArgs(a.args, scalarNames)}\n${TAB(2)}};`;
      });
      return `${TAB(1)}['${t.name}']: {\n${typeFields.join('\n')}\n${TAB(1)}};`;
    })
    .join('\n');

  const dbTypes = types
    .map((t) => {
      const tname = `export interface ${t.name}<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {\n${t.args.map((a) => `${resolveField(a, scalarNames)};`).join('\n')}\n}`;
      return tname;
    })
    .join('\n');

  const directives = nodes.filter((n) => n.data.type === TypeSystemDefinition.DirectiveDefinition);
  const directivesString = directives
    .map((a) => {
      return `${TAB(1)}${a.name}: {\n${TAB(2)}args: ${buildArgs(a.args, scalarNames)}\n${TAB(1)}};`;
    })
    .join('\n');

  const typesFullString = `export type Models<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> = {\n${typesString}\n};`;
  const directivesFullString = directivesString
    ? `export type Directives<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> = {\n${directivesString}\n};`
    : 'export type Directives<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> = unknown;';
  return (
    '/* eslint-disable @typescript-eslint/no-unused-vars */\n' +
    '/* eslint-disable @typescript-eslint/no-explicit-any */\n\n' +
    [
      scalarsString,
      scalarsFullString,
      enumsString,
      inputsString,
      typesFullString,
      directivesFullString,
      interfacesString,
      unionsString,
      dbTypes,
    ]
      .filter(Boolean)
      .join('\n\n') +
    '\n'
  );
};

export const generateModels = ({
  schemaPath = './schema.graphql',
  modelsPath = './models.ts',
}: {
  schemaPath: string;
  modelsPath: string;
}) => {
  const fileContent = readFileSync(schemaPath, 'utf8');
  const modelsString = generateModelsString(fileContent);
  writeFileSync(modelsPath, modelsString);
};
