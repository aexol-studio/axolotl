import * as runtime from "@prisma/client/runtime/client";
const config = {
    "previewFeatures": [],
    "clientVersion": "7.2.0",
    "engineVersion": "0c8ef2ce45c83248ab3df073180d5eda9e8be7a3",
    "activeProvider": "postgresql",
    "inlineSchema": "generator client {\n  provider = \"prisma-client\"\n  output   = \"../src/generated/prisma\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nmodel User {\n  id        String   @id @default(cuid())\n  username  String   @unique\n  password  String\n  token     String?\n  todos     Todo[]\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Todo {\n  id        String   @id @default(cuid())\n  content   String\n  done      Boolean  @default(false)\n  owner     User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)\n  ownerId   String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n",
    "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
    }
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"username\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"password\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"token\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"todos\",\"kind\":\"object\",\"type\":\"Todo\",\"relationName\":\"TodoToUser\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Todo\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"done\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"owner\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"TodoToUser\"},{\"name\":\"ownerId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}");
async function decodeBase64AsWasm(wasmBase64) {
    const { Buffer } = await import('node:buffer');
    const wasmArray = Buffer.from(wasmBase64, 'base64');
    return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
    getRuntime: async () => await import("@prisma/client/runtime/query_compiler_bg.postgresql.mjs"),
    getQueryCompilerWasmModule: async () => {
        const { wasm } = await import("@prisma/client/runtime/query_compiler_bg.postgresql.wasm-base64.mjs");
        return await decodeBase64AsWasm(wasm);
    }
};
export function getPrismaClientClass() {
    return runtime.getPrismaClient(config);
}
//# sourceMappingURL=class.js.map