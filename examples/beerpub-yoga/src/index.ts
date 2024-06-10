/* eslint-disable @typescript-eslint/no-explicit-any */
import { graphqlYogaAdapter } from '@aexol/axolotl-graphql-yoga';
import { applyMiddleware } from '@/src/axolotl.js';
import resolvers from '@/src/resolvers.js';

// This is yoga specifica
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

graphqlYogaAdapter(resolvers).listen(parseInt(process.env.PORT || '4000'), () => {
  console.log('LISTENING to ' + process.env.PORT || '4000');
});
