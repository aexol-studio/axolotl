import fs from 'node:fs/promises';
import { Writable } from 'node:stream';
import express from 'express';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { adapter } from '@/src/axolotl.js';
import resolvers from '@/src/resolvers.js';
import directives from './directives.js';
import { parseCookies, getLocaleFromCookies } from './utils/cookies.js';
import { verifyToken } from './utils/auth.js';
import { prisma } from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';

// Cached production assets
const templateHtml = isProduction ? await fs.readFile(resolve(__dirname, '../dist/client/index.html'), 'utf-8') : '';

const startServer = async () => {
  const app = express();
  const port = parseInt(process.env.PORT || '8080', 10);

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
        graphiql: !isProduction && {
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
  register(email: "user@example.com",password: "password")
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
  app.use('/graphql', yoga as unknown as express.RequestHandler);

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

      type RenderFn = (
        request: Request,
        options: { isAuthenticated: boolean; locale?: string },
      ) => Promise<{
        pipe: (s: Writable) => void;
        statusCode: number;
        redirectUrl?: string;
        head: string;
        locale: string;
        translations: Record<string, string>;
      }>;

      let template: string;
      let render: RenderFn;

      if (!isProduction) {
        // Always read fresh template in development
        template = await fs.readFile(resolve(__dirname, '../frontend/index.html'), 'utf-8');
        template = await vite!.transformIndexHtml(url, template);
        render = (await vite!.ssrLoadModule('/src/entry-server.tsx')).render as RenderFn;
      } else {
        template = templateHtml;
        // @ts-expect-error - entry-server.js is built by vite build:server and only exists at runtime
        render = (await import('../dist/server/entry-server.js')).render as RenderFn;
      }

      let isAuthenticated = false;
      const authCookie = req.cookies?.['auth-token'];
      if (authCookie) {
        try {
          const payload = verifyToken(authCookie);
          const session = await prisma.session.findFirst({
            where: {
              token: payload.jti,
              expiresAt: { gt: new Date() },
            },
            select: { token: true },
          });
          isAuthenticated = !!session;
        } catch {
          isAuthenticated = false;
        }
      }

      const locale = getLocaleFromCookies(req.cookies);

      // Build Web Request from Express req, forwarding all headers plus auth/locale context
      const origin = `${req.protocol}://${req.get('host') ?? 'localhost'}`;
      const headerEntries: [string, string][] = Object.entries(req.headers)
        .filter((entry): entry is [string, string | string[]] => entry[1] !== undefined)
        .map(([k, v]): [string, string] => [k, Array.isArray(v) ? v.join(', ') : v]);
      const webHeaders = new Headers(headerEntries);
      webHeaders.set('x-authenticated', isAuthenticated ? 'true' : 'false');
      webHeaders.set('x-locale', locale);
      const webRequest = new Request(`${origin}${url}`, { method: req.method, headers: webHeaders });

      const rendered = await render(webRequest, { isAuthenticated, locale });

      // Handle redirect — return immediately without rendering HTML
      if (rendered.redirectUrl) {
        res.redirect(rendered.statusCode, rendered.redirectUrl);
        return;
      }

      // Collect the pipeableStream into a string
      const chunks: Buffer[] = [];
      const writable = new Writable({
        write(chunk: Buffer, _encoding: BufferEncoding, callback: () => void) {
          chunks.push(chunk);
          callback();
        },
      });
      rendered.pipe(writable);
      await new Promise<void>((resolve, reject) => {
        writable.on('finish', resolve);
        writable.on('error', reject);
      });
      const appHtml = Buffer.concat(chunks).toString('utf-8');

      // Inject initial state — translations loaded by rootLoader on client, but window state still
      // needed for subsequent client-side navigations and initial locale resolution
      const initialStateScript = [
        `<script>`,
        `window.__INITIAL_AUTH__=${JSON.stringify({ isAuthenticated })};`,
        `window.__INITIAL_TRANSLATIONS__=${JSON.stringify(rendered.translations)};`,
        `window.__INITIAL_LOCALE__=${JSON.stringify(rendered.locale)};`,
        `</script>`,
      ].join('');

      let resultHtml = template
        .replace('<!--app-head-->', rendered.head)
        .replace('<!--app-initial-state-->', initialStateScript)
        .replace('<!--app-html-->', appHtml);

      // Set the HTML lang attribute to match the rendered locale
      resultHtml = resultHtml.replace('lang="en"', `lang="${rendered.locale}"`);

      res.status(rendered.statusCode).set({ 'Content-Type': 'text/html' }).send(resultHtml);
    } catch (e) {
      vite?.ssrFixStacktrace(e as Error);
      console.error((e as Error).stack);
      next(e);
    }
  });

  const server = app.listen(port, () => {
    console.log(`Server running at port ${port}`);
    console.log(`AI Chat available via GraphQL subscription: aiChat`);
    console.log(`Mode: ${isProduction ? 'production' : 'development'}`);
    console.log(`SSR: enabled`);
  });

  let isShuttingDown = false;
  const shutdown = async (signal: string) => {
    if (isShuttingDown) {
      return;
    }
    isShuttingDown = true;
    console.log(`Received ${signal}. Shutting down...`);

    setTimeout(() => {
      console.error('Shutdown timed out, forcing exit.');
      process.exit(1);
    }, 10_000).unref();

    try {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });

      if (vite) {
        await vite.close();
      }

      if ('dispose' in yoga && typeof yoga.dispose === 'function') {
        await yoga.dispose();
      }

      await prisma.$disconnect();

      console.log('Shutdown complete.');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  };

  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });

  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
};

startServer().catch(console.error);
