#!/usr/bin/env node
/* eslint-disable no-console */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as process from "node:process";
import {
  buildSchema,
  buildClientSchema,
  getIntrospectionQuery,
  printSchema,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLField,
  GraphQLInputType,
  isNonNullType,
  isListType,
  GraphQLType,
  GraphQLNamedType,
} from "graphql";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { Command } from 'commander';
import chalk from 'chalk';

// Simple CLI arg parsing
type CliOptions = {
  schema: string;           // URL or file path
  endpoint?: string;        // HTTP URL to execute operations (defaults to schema if schema is URL)
  header?: string[];        // Optional headers (repeatable, "Key: Value")
};

export const mcpCommand = (program: Command) => {
  program
    .command('mcp')
    .argument('<schema>', 'URL or file path to GraphQL schema')
    .option('-e, --endpoint <url>', 'HTTP URL to execute operations (defaults to schema if schema is URL)')
    .option('-H, --header <header>', 'Optional headers (repeatable, "Key: Value")')
    .description(`${chalk.greenBright('Axolotl MCP')} - Model Context Protocol server for GraphQL`)
    .action(startMcpServer);
};

export const startMcpServer = async (
  schema: string,
  options: { endpoint?: string; header?: string[] }
) => {
  const opts: CliOptions = { 
    schema, 
    endpoint: options.endpoint, 
    header: options.header 
  };

  const defaultHeaders = parseHeaders(opts.header);

  const isUrl = isHttpUrl(opts.schema);
  const endpoint = opts.endpoint ?? (isUrl ? opts.schema : undefined);
  if (!endpoint) {
    console.error("When --schema is a local file, you must provide --endpoint <url> to execute requests.");
    process.exit(1);
  }

  const schemaGraphQL: GraphQLSchema = isUrl
    ? await loadSchemaFromUrl(opts.schema, defaultHeaders)
    : await loadSchemaFromFile(path.resolve(opts.schema));

  const server = new McpServer(
    { name: "graphql-mcp", version: "0.1.0" },
    { capabilities: {} }
  );

  // Register generic tools
  registerGenericTools(server, schemaGraphQL, { endpoint, defaultHeaders });

  // Register one tool per Query/Mutation field
  const queryType = schemaGraphQL.getQueryType() as GraphQLObjectType | null;
  const mutationType = schemaGraphQL.getMutationType() as GraphQLObjectType | null;

  if (queryType) {
    const fields = queryType.getFields();
    for (const f of Object.values(fields)) {
      registerFieldTool(server, "Query", f, { endpoint, defaultHeaders });
    }
  }

  if (mutationType) {
    const fields = mutationType.getFields();
    for (const f of Object.values(fields)) {
      registerFieldTool(server, "Mutation", f, { endpoint, defaultHeaders });
    }
  }

  // Start MCP server over stdio
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Graceful shutdown
  const shutdown = async () => {
    try {
      await server.close();
    } finally {
      process.exit(0);
    }
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

// Helpers
function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function parseHeaders(headerArgs?: string[]): Record<string, string> {
  const headers: Record<string, string> = {};
  for (const h of headerArgs ?? []) {
    const idx = h.indexOf(":");
    if (idx === -1) continue;
    const key = h.slice(0, idx).trim();
    const val = h.slice(idx + 1).trim();
    if (key) headers[key] = val;
  }
  return headers;
}

async function fetchIntrospection(url: string, headers: Record<string, string>): Promise<any> {
  const query = getIntrospectionQuery({
    descriptions: true,
    directiveIsRepeatable: true,
    schemaDescription: true,
    inputValueDeprecation: true,
  });
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Introspection failed (${res.status}): ${text || res.statusText}`);
  }
  const json = await res.json();
  if (json.errors) {
    throw new Error(`Introspection errors: ${JSON.stringify(json.errors, null, 2)}`);
  }
  return json.data;
}

async function loadSchemaFromUrl(url: string, headers: Record<string, string>): Promise<GraphQLSchema> {
  const data = await fetchIntrospection(url, headers);
  return buildClientSchema(data);
}

async function loadSchemaFromFile(file: string): Promise<GraphQLSchema> {
  const raw = await fs.readFile(file, "utf8");
  // Try JSON introspection first
  try {
    const json = JSON.parse(raw);
    const data = json.data ?? json;
    return buildClientSchema(data);
  } catch {
    // Not JSON; try SDL
    return buildSchema(raw);
  }
}

function typeToString(t: GraphQLType): string {
  if (isNonNullType(t)) return `${typeToString(t.ofType)}!`;
  if (isListType(t)) return `[${typeToString(t.ofType)}]`;
  const named = t as GraphQLNamedType;
  return named.name;
}

function argsVarDefsForField(field: GraphQLField<any, any>, providedArgs: Record<string, any>): string {
  // Only include variables actually provided by the caller
  const defs: string[] = [];
  for (const arg of field.args) {
    if (Object.prototype.hasOwnProperty.call(providedArgs, arg.name)) {
      defs.push(`$${arg.name}: ${typeToString(arg.type as GraphQLInputType)}`);
    }
  }
  return defs.length ? `(${defs.join(", ")})` : "";
}

function argsAssignmentsForField(field: GraphQLField<any, any>, providedArgs: Record<string, any>): string {
  const assigns: string[] = [];
  for (const arg of field.args) {
    if (Object.prototype.hasOwnProperty.call(providedArgs, arg.name)) {
      assigns.push(`${arg.name}: $${arg.name}`);
    }
  }
  return assigns.length ? `(${assigns.join(", ")})` : "";
}

function buildOperation(
  opType: "query" | "mutation",
  field: GraphQLField<any, any>,
  selection: string,
  providedArgs: Record<string, any>
): string {
  const varDefs = argsVarDefsForField(field, providedArgs);
  const assigns = argsAssignmentsForField(field, providedArgs);
  // User-provided selection should be a valid selection set (e.g., "id name" or "{ id name }")
  const cleanedSelection =
    selection.trim().startsWith("{") ? selection.trim() : `{ ${selection.trim()} }`;
  return `${opType} ${field.name}${varDefs} { ${field.name}${assigns} ${cleanedSelection} }`;
}

type ExecOptions = {
  endpoint: string;
  defaultHeaders?: Record<string, string>;
};

async function executeGraphQL(
  endpoint: string,
  query: string,
  variables: Record<string, any> | undefined,
  headers: Record<string, string> | undefined
): Promise<any> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(headers ?? {}),
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json().catch(async () => ({ text: await res.text().catch(() => "") }));
  if (!res.ok) {
    throw new Error(`GraphQL HTTP error ${res.status}: ${typeof json === "string" ? json : JSON.stringify(json)}`);
  }
  return json;
}

function registerFieldTool(
  server: McpServer,
  parentName: "Query" | "Mutation",
  field: GraphQLField<any, any>,
  exec: ExecOptions
) {
  const opType = parentName === "Query" ? "query" : "mutation";
  const toolName = `${opType}.${field.name}`;

  server.registerTool(
    toolName,
    {
      description: `${opType.toUpperCase()} ${field.name}`,
      inputSchema: {
        selection: z.string().describe(
          "GraphQL selection set for this field (e.g., 'id name' or '{ id name }'). Required by GraphQL."
        ),
        args: z.record(z.any()).optional().describe(
          `Arguments for ${field.name} (object keyed by argument name).`
        ),
        headers: z.record(z.string()).optional().describe(
          "Optional extra HTTP headers for this request."
        ),
      },
    },
    async (input, _extra) => {
      const args = input.args ?? {};
      const query = buildOperation(opType, field, input.selection, args);
      const result = await executeGraphQL(
        exec.endpoint,
        query,
        args,
        { ...(exec.defaultHeaders ?? {}), ...(input.headers ?? {}) }
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}

function registerGenericTools(server: McpServer, schema: GraphQLSchema, exec: ExecOptions) {
  // Raw GraphQL executor
  server.registerTool(
    "graphql.raw",
    {
      description:
        "Execute an arbitrary GraphQL operation string with optional variables and headers.",
      inputSchema: {
        query: z.string().describe("GraphQL operation (query/mutation)."),
        variables: z.record(z.any()).optional().describe("Variables for the operation."),
        headers: z.record(z.string()).optional().describe("Optional extra HTTP headers for this request."),
      },
    },
    async (input, _extra) => {
      const result = await executeGraphQL(
        exec.endpoint,
        input.query,
        input.variables ?? {},
        { ...(exec.defaultHeaders ?? {}), ...(input.headers ?? {}) }
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Return the printed SDL of the schema
  server.registerTool(
    "schema.print",
    {
      description: "Return the current GraphQL schema as SDL.",
    },
    async () => {
      const sdl = printSchema(schema);
      return { content: [{ type: "text", text: sdl }] };
    }
  );
}