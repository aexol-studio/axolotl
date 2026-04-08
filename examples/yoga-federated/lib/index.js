import fs from 'node:fs/promises';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { adapter } from "./axolotl.js";
import resolvers from "./resolvers.js";
import directives from './directives.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const templateHtml = isProduction ? await fs.readFile(resolve(__dirname, '../dist/client/index.html'), 'utf-8') : '';
async function startServer() {
    const app = express();
    const port = parseInt(process.env.PORT || '4102', 10);
    const { yoga } = adapter({ resolvers, directives }, {
        yoga: {
            graphqlEndpoint: '/graphql',
            graphiql: {
                defaultQuery: `query MyTodos{
  user{
    todos{
      _id
      content
      done
    }
  }
}

mutation CreateTodo{
  user{
    createTodo(content: "hello")
  }
}

mutation Done{
  user{
    todoOps(_id: "0.12217321412133557"){
      markDone
    }
  }
}

mutation Register{
  register(username: "user",password: "password")
}

# AI Chat via GraphQL Subscription
# Use the subscription below to stream AI responses:
#
# subscription AIChat {
#   aiChat(messages: [{role: "user", content: "Hello!"}]) {
#     content
#     done
#   }
# }`,
            },
        },
    });
    app.use('/graphql', yoga);
    let vite;
    if (!isProduction) {
        vite = await createViteServer({
            configFile: resolve(__dirname, '../vite.config.ts'),
            server: { middlewareMode: true },
            appType: 'custom',
        });
        app.use(vite.middlewares);
    }
    else {
        const compression = (await import('compression')).default;
        const sirv = (await import('sirv')).default;
        app.use(compression());
        app.use(sirv(resolve(__dirname, '../dist/client'), { extensions: [] }));
    }
    app.use('*all', async (req, res, next) => {
        if (req.originalUrl.startsWith('/graphql') || req.originalUrl.startsWith('/api/')) {
            return next();
        }
        try {
            const url = req.originalUrl;
            let template;
            let render;
            if (!isProduction) {
                template = await fs.readFile(resolve(__dirname, '../frontend/index.html'), 'utf-8');
                template = await vite.transformIndexHtml(url, template);
                render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
            }
            else {
                template = templateHtml;
                render = (await import('../dist/server/entry-server.js')).render;
            }
            const rendered = await render(url);
            const html = template
                .replace(`<!--app-head-->`, rendered.head ?? '')
                .replace(`<!--app-html-->`, rendered.html ?? '');
            res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
        }
        catch (e) {
            vite?.ssrFixStacktrace(e);
            console.error(e.stack);
            next(e);
        }
    });
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
        console.log(`GraphQL Playground at http://localhost:${port}/graphql`);
        console.log(`AI Chat available via GraphQL subscription: aiChat`);
        console.log(`Mode: ${isProduction ? 'production' : 'development'}`);
        console.log(`SSR: enabled`);
    });
}
startServer().catch(console.error);
//# sourceMappingURL=index.js.map