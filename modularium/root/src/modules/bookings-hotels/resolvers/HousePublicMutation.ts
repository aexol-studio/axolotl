import { HouseModel, MongOrb } from '@/src/modules/bookings-hotels/orm.js';
import { getEnv, mg, priceForPeriod, throwOnOverLap } from '@/src/modules/bookings-hotels/utils.js';
import {
  CONFIRMATION_MAIL,
  NOTIFICATION_MAIL,
  HTML_CONFIRMATION_MAIL,
} from '@/src/modules/bookings-hotels/maile/confirmation.js';
import { createResolvers } from '@/src/modules/bookings-hotels/axolotl.js';
import { ReservationStatus } from '@/src/modules/bookings-hotels/models.js';

export const resolvers = createResolvers({
  HousePublicMutation: {
    reserve: async (input, args) => {
      const houseSource = input[0] as HouseModel;
      await throwOnOverLap(houseSource, args.reservation);
      const price = await priceForPeriod({
        houseSource,
        period: args.reservation,
        additionalReservationOptions: args.reservation,
      });
      const reservation = await MongOrb('Reservation').createWithAutoFields('_id')({
        house: houseSource._id,
        status: ReservationStatus.PENDING,
        price,
        owner: houseSource.owner,
        ...args.reservation,
      });
      const reservationId = reservation.insertedId;
      if (reservation.insertedId) {
        try {
          await mg.messages.create(getEnv('MAILGUN_DOMAIN'), {
            from: getEnv('MAILGUN_SENDER'),
            to: args.reservation.email,
            subject: `Twoja rezerwacja Podlaskie Wakacje`,
            text: CONFIRMATION_MAIL({ ...args.reservation, price, reservationId }),
            html: HTML_CONFIRMATION_MAIL({ ...args.reservation, price, reservationId }),
          });
          await mg.messages.create(getEnv('MAILGUN_DOMAIN'), {
            from: getEnv('MAILGUN_SENDER'),
            to: getEnv('MAILGUN_SENDER'),
            'h:Reply-To': args.reservation.email,
            subject: `Nowa rezerwacja -${args.reservation.from} do ${args.reservation.to}`,
            text: NOTIFICATION_MAIL({ ...args.reservation, price, reservationId }),
          });
        } catch (error) {
          console.log(error);
        }
      }
      return reservation.insertedId;
    },
  },
});
