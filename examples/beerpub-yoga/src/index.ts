import { adapter } from '@/src/axolotl.js';
import resolvers from '@/src/resolvers.js';
import directives from '@/src/directives.js';
import scalars from '@/src/scalars.js';
import { useResponseCache } from '@envelop/response-cache';

adapter(
  {
    resolvers,
    scalars,
    directives,
  },
  {
    yoga: {
      plugins: [
        useResponseCache({
          ttl: 0,
          session: (ctx) => ctx.request.headers.get('x-session-id') || null,
        }),
      ],
    },
  },
).server.listen(parseInt(process.env.PORT || '4002'), () => {
  console.log('LISTENING to ' + process.env.PORT || '4002');
});
