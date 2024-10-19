import { adapter } from './axolotl.ts';
import resolvers from './resolvers.ts';

Deno.serve(adapter({resolvers}).yoga);
