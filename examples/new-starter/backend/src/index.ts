import fs from 'node:fs/promises';
import express from 'express';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { adapter } from '@/src/axolotl.js';
import resolvers from '@/src/resolvers.js';
import directives from './directives.js';
import { parseCookies, serializeClearCookie } from './lib/cookies.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';

// Cached production assets
const templateHtml = isProduction ? await fs.readFile(resolve(__dirname, '../dist/client/index.html'), 'utf-8') : '';

async function startServer() {
  const app = express();
  const port = parseInt(process.env.PORT || '4102', 10);

  // Parse cookies from request headers
  app.use((req, _res, next) => {
    req.cookies = parseCookies(req.headers.cookie ?? null);
    next();
  });

  // Create Axolotl/Yoga instance
  const { yoga } = adapter(
    { resolvers, directives },
    {
      schema: {
        file: { path: 'backend/schema.graphql' },
      },
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
    },
  );

  // Mount GraphQL at /graphql (includes AI chat via subscription)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.use('/graphql', yoga as any);

  // Logout endpoint — clears the auth cookie
  app.post('/api/logout', (_req, res) => {
    res.setHeader('Set-Cookie', serializeClearCookie());
    res.status(200).json({ success: true });
  });

  // Add Vite or respective production middlewares
  let vite: ViteDevServer | undefined;
  if (!isProduction) {
    vite = await createViteServer({
      configFile: resolve(__dirname, '../frontend/vite.config.ts'),
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  } else {
    const compression = (await import('compression')).default;
    const sirv = (await import('sirv')).default;
    app.use(compression());
    app.use(sirv(resolve(__dirname, '../dist/client'), { extensions: [] }));
  }

  // Serve HTML with SSR
  app.use('*all', async (req, res, next) => {
    // Skip API requests
    if (req.originalUrl.startsWith('/graphql') || req.originalUrl.startsWith('/api/')) {
      return next();
    }

    try {
      const url = req.originalUrl;

      let template: string;
      let render: (url: string, options?: { isAuthenticated: boolean }) => { html: string; head?: string };

      if (!isProduction) {
        // Always read fresh template in development
        template = await fs.readFile(resolve(__dirname, '../frontend/index.html'), 'utf-8');
        template = await vite!.transformIndexHtml(url, template);
        render = (await vite!.ssrLoadModule('/src/entry-server.tsx')).render;
      } else {
        template = templateHtml;
        // @ts-expect-error - entry-server.js is built by vite build:server and only exists at runtime
        render = (await import('../dist/server/entry-server.js')).render;
      }

      const authToken = req.cookies?.['auth-token'];
      const isAuthenticated = !!authToken;

      const rendered = await render(url, { isAuthenticated });

      const initialStateScript = `<script>window.__INITIAL_AUTH__=${JSON.stringify({ isAuthenticated })}</script>`;

      const html = template
        .replace(`<!--app-head-->`, rendered.head ?? '')
        .replace(`<!--app-initial-state-->`, initialStateScript)
        .replace(`<!--app-html-->`, rendered.html ?? '');

      res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
    } catch (e) {
      vite?.ssrFixStacktrace(e as Error);
      console.error((e as Error).stack);
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
