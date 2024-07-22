import { mergeAxolotls } from '@aexol/axolotl-core';
import beerResolvers from '@/src/beers/resolvers.js';
import shopResolvers from '@/src/shop/resolvers.js';

export default mergeAxolotls(beerResolvers, shopResolvers);
