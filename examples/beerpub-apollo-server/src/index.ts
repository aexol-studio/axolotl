import { startStandaloneServer } from '@apollo/server/standalone';
import { adapter, applyMiddleware } from '@/src/axolotl.js';
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

const {url } = await startStandaloneServer(adapter({resolvers}))
console.log(`Server ready at ${url}`);

