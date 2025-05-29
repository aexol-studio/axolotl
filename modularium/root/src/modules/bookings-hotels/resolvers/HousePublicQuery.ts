import { HouseModel } from '@/src/modules/bookings-hotels/orm.js';
import { compileAvailabilities, priceForPeriod } from '@/src/modules/bookings-hotels/utils.js';
import { createResolvers } from '@/src/modules/bookings-hotels/axolotl.js';

export const resolvers = createResolvers({
  HousePublicQuery: {
    getAvailability: async (input) => {
      const houseSource = input[0] as HouseModel;
      const availabilities = await compileAvailabilities({ houseSource });
      return availabilities.map((av) => ({
        ...av,
        price: av.price[0].price,
      }));
    },
    house: async (input) => {
      const houseSource = input[0] as HouseModel;
      return houseSource;
    },
    getPrice: async (input, args) => {
      const houseSource = input[0] as HouseModel;
      return priceForPeriod({ houseSource, period: args.period });
    },
  },
});
