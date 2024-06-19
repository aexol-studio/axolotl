import { FieldResolveInput } from 'stucco-js';
import { applyMiddleware, adapter } from '@/src/axolotl.js';
import resolvers from '@/src/resolvers.js';

// This is stucco specific
export default async (input: FieldResolveInput) => {
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
  return adapter(resolvers)(input);
};
