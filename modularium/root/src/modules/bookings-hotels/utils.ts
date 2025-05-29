const { default: Mailgun } = await import('mailgun.js');
import formData from 'form-data';
import { add, eachDayOfInterval, format } from 'date-fns';
import { HouseModel, MongOrb } from '@/src/modules/bookings-hotels/orm.js';
import { CreateReservation, EditReservation } from '@/src/models.js';
import { Availability } from '@/src/modules/bookings-hotels/models.js';

export const getEnv = (env: string) => {
  const f = process.env[env];
  if (!f) throw new Error(`Env variable not defined: ${env}`);
  return f;
};

const mailgun = new Mailgun(formData);

export const mg = mailgun.client({
  key: getEnv('MAILGUN_API_KEY'),
  url: getEnv('MAILGUN_SERVER_DOMAIN'),
  username: 'api',
});

export const sendSystemMail = ({
  to,
  subject,
  ...rest
}: { to: string; subject: string } & ({ text: string } | { html: string })) => {
  return mg.messages.create(getEnv('MAILGUN_DOMAIN'), {
    from: getEnv('MAILGUN_SENDER'),
    to,
    subject,
    ...rest,
  });
};

export const fromToDayInterval = ({ from, to }: { from: string; to: string }) => {
  return eachDayOfInterval({
    start: new Date(from),
    end: new Date(to),
  });
};

export const formatToDate = (date: Parameters<typeof format>[0]) => format(date, 'yyyy-MM-dd');

export const compileAvailabilities = async ({ houseSource }: { houseSource: HouseModel }) => {
  const [seasons, priceRules] = await Promise.all([
    MongOrb('Season').collection.find({}).toArray(),
    MongOrb('PricingRule')
      .collection.find({
        house: houseSource._id,
      })
      .toArray(),
  ]);

  const seasonsFormatted = seasons.map((s) => {
    const fromMonth = s.from.split('-')[0];
    const fromDay = s.from.split('-')[1];
    const toMonth = s.to.split('-')[0];
    const toDay = s.to.split('-')[1];
    return {
      _id: s._id,
      fromMonth,
      fromDay,
      toMonth,
      toDay,
    };
  });

  const reservations = await MongOrb('Reservation').collection.find({}).toArray();
  const reservedDates = reservations.flatMap(fromToDayInterval).map(formatToDate);

  const currentDate = new Date();

  const days = eachDayOfInterval({
    start: currentDate,
    end: add(currentDate, { days: 365 }),
  });

  return days.map((day) => {
    const [mm, dd] = format(day, 'MM-dd').split('-');
    const monthNumeric = parseInt(mm);
    const dayNumeric = parseInt(dd);

    const seasonForDate = seasonsFormatted.find((s) => {
      const seasonMonthFrom = parseInt(s.fromMonth);
      const seasonMonthTo = parseInt(s.toMonth);
      const seasonDayFrom = parseInt(s.fromDay);
      const seasonDayTo = parseInt(s.toDay);
      if (monthNumeric < seasonMonthFrom) return;
      if (monthNumeric > seasonMonthTo) return;
      if (monthNumeric !== seasonMonthFrom) return true;
      if (monthNumeric !== seasonMonthTo) return true;
      if (monthNumeric === seasonMonthFrom) {
        if (dayNumeric < seasonDayFrom) return;
        return true;
      }
      if (monthNumeric === seasonMonthTo) {
        if (dayNumeric > seasonDayTo) return;
        return true;
      }
      return;
    });

    const pricesForSeason = seasonForDate && priceRules.filter((pr) => pr.season === seasonForDate._id);

    const priceForDate = pricesForSeason?.length
      ? pricesForSeason.map((p) => ({
          price: p.price,
          maxDays: p.maxDays,
        }))
      : [
          {
            price: houseSource.outOfSeasonPrice,
            maxDays: Infinity,
          },
        ];

    const formatted = formatToDate(day);

    return {
      date: formatted,
      price: priceForDate,
      booked: reservedDates.includes(formatted),
      start: reservations.map((rsv) => rsv.from).includes(formatted),
      end: reservations.map((rsv) => rsv.to).includes(formatted),
    } satisfies Omit<Availability, 'price'> & { price: typeof priceForDate };
  });
};

export const throwOnOverLap = async (houseSource: HouseModel, { from, to }: CreateReservation) => {
  const availabilities = await compileAvailabilities({ houseSource });
  const dateIntervalPre = fromToDayInterval({ from, to }).map(formatToDate);
  const startAvaialbility = availabilities.find((av) => av.date === from);
  if (startAvaialbility?.booked && !startAvaialbility.end) {
    throw Error('Cannot book during other vacation');
  }
  const endAvailability = availabilities.find((av) => av.date === to);
  if (endAvailability?.booked && !endAvailability.start) {
    throw Error('Cannot book during other vacation');
  }
  const slicedInterval = dateIntervalPre.slice(1, dateIntervalPre.length - 1);
  if (slicedInterval.length) {
    slicedInterval.forEach((si) => {
      const intervalAvailability = availabilities.find((av) => av.date === si);
      if (intervalAvailability?.booked) {
        throw Error('Cannot book during other vacation');
      }
    });
  }
};

export const priceForPeriod = async ({
  houseSource,
  period,
  additionalReservationOptions,
}: {
  houseSource: HouseModel;
  period: { from: string; to: string };
  additionalReservationOptions?: EditReservation;
}) => {
  const availabilities = await compileAvailabilities({ houseSource });
  const dateIntervalPre = fromToDayInterval(period).map(formatToDate);
  const dateInterval = dateIntervalPre.slice(0, dateIntervalPre.length - 1);
  const stayLength = dateInterval.length;
  const prices = availabilities.filter((av) => dateInterval.includes(av.date));
  let finalPrice = prices.reduce((a, b) => {
    let price = 0;
    const possiblePrices = b.price.filter((pr) => pr.maxDays >= stayLength);
    if (possiblePrices.length === 0) {
      let highest = 0;
      for (const pp of b.price) {
        if (pp.maxDays > highest) {
          highest = pp.maxDays;
          price = pp.price;
        }
      }
    } else {
      let lowest = Infinity;
      for (const pp of possiblePrices) {
        if (pp.maxDays <= lowest) {
          lowest = pp.maxDays;
          price = pp.price;
        }
      }
    }
    return a + price;
  }, 0);
  if (additionalReservationOptions?.houseAddons?.length) {
    if (additionalReservationOptions.houseAddons.some((ha) => !houseSource.addons?.includes(ha))) {
      throw new Error('Invalid house addon. This addon is not assigned to specified house');
    }
    const addons = await MongOrb('HouseAddon')
      .collection.find({
        _id: {
          $in: additionalReservationOptions.houseAddons,
        },
      })
      .toArray();
    const totalAddonsPrice = addons
      .filter((a) => !a.perDay)
      .map((a) => a.price)
      .reduce((a, b) => a + b, 0);
    const totalAddonsPricePerDay =
      addons
        .filter((a) => !!a.perDay)
        .map((a) => a.price)
        .reduce((a, b) => a + b, 0) * stayLength;
    finalPrice = finalPrice + totalAddonsPrice + totalAddonsPricePerDay;
  }
  return finalPrice;
};
