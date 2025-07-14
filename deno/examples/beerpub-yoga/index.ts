import { adapter } from './axolotl.js';
import resolvers from './resolvers.js';

Deno.serve(adapter({resolvers}).yoga);
