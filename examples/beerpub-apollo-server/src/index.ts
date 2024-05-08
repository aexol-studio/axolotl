import { startStandaloneServer } from '@apollo/server/standalone';
import { apolloServerAdapter } from '@aexol/axolotl-apollo-server';
import { applyMiddleware } from '@/src/axolotl.js';
import resolvers from '@/src/resolvers.js';


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

const {url } = await startStandaloneServer(apolloServerAdapter(resolvers))
console.log(`Server ready at ${url}`);

