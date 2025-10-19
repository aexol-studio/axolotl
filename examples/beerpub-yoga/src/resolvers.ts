import { createResolvers } from '@/src/axolotl.js';
import { Beer } from '@/src/models.js';

const Beers: Beer[] = [
  {
    _id: '0',
    createdAt: '2023-10-10T15:21:43.038Z',
    name: 'Kumple',
    price: 10,
    info: 'Dobre piwko',
  },
  {
    _id: '1',
    createdAt: '2023-10-11T14:51:09.029Z',
    name: 'Zubr',
    price: 100,
    url: 'https://zubr.pl',
  },
];

const resolvers = createResolvers({
  Query: {
    userIsActive: ([, , context]) => (context.user.id === 'user-123' ? true : false),
    beers: () => Beers,
    testAuth: () => 'TOP SECRET',
    activity: async () => {
      return {};
    },
  },
  UserActivity: {
    isActive: async (input) => input[2].isActive,
  },
  Mutation: {
    addBeer: (input, args) => {
      return Beers.push({ ...args.beer, _id: Beers.length + 1 + '', createdAt: new Date().toISOString() });
    },
    deleteBeer: (input, args) => {
      return Beers.splice(Beers.findIndex((b) => b._id === args._id));
    },
    updateBeer: (input, args) => {
      const oldElement = Beers.find((b) => b._id);
      if (!oldElement) return false;
      Object.assign(oldElement, args.beer);
      return true;
    },
  },
});
export default resolvers;
