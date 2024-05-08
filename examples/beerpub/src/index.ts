import { FieldResolveInput } from 'stucco-js';
import { stuccoAdapter } from '@aexol/axolotl-stucco';
import { applyMiddleware } from '@/src/axolotl.js';
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
  return stuccoAdapter(resolvers)(input);
};
