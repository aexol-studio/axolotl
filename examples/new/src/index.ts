import fs from 'node:fs/promises';
import express from 'express';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { adapter } from '@/src/axolotl.js';
import resolvers from '@/src/resolvers.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';

// Cached production assets
const templateHtml = isProduction ? await fs.readFile(resolve(__dirname, '../dist/client/index.html'), 'utf-8') : '';

async function startServer() {
  const app = express();
  const port = parseInt(process.env.PORT || '8080', 10);

  // Create Axolotl/Yoga instance
  const { yoga } = adapter(
    { resolvers },
    {
      yoga: {
        graphqlEndpoint: '/graphql',
        graphiql: {
          defaultQuery: `query Hello {
  hello
}

mutation Echo {
  echo(message: "Hello from Axolotl!")
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

  // Add Vite or respective production middlewares
  let vite: ViteDevServer | undefined;
  if (!isProduction) {
    vite = await createViteServer({
      configFile: resolve(__dirname, '../vite.config.ts'),
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
      let render: (url: string) => Promise<{ html: string; head?: string } | { redirect: string; status: number }>;

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

      const rendered = await render(url);

      // Handle redirect
      if ('redirect' in rendered) {
        return res.redirect(rendered.status, rendered.redirect);
      }

      const html = template
        .replace(`<!--app-head-->`, rendered.head ?? '')
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
