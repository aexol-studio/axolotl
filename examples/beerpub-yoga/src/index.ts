import { adapter, applyMiddleware } from '@/src/axolotl.js';
import resolvers from '@/src/resolvers.js';
import directives from '@/src/directives.js';

// This is yoga specific
applyMiddleware(
  resolvers,
  [
    (input) => {
      console.log('Hello from Middleware I run only on Query.beers');
      return input;
    },
  ],
  { Query: { beers: true } },
);

adapter({ resolvers, directives }).listen(parseInt(process.env.PORT || '4000'), () => {
  console.log('LISTENING to ' + process.env.PORT || '4000');
});
