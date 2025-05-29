export type RichText = unknown;
export type GeneratedCode = unknown;

export enum ReservationStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export interface DeterminePrice {
  from: string;
  to: string;
}
export interface CreateReservation {
  from: string;
  to: string;
  guests: number;
  message?: string | undefined;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address?: string | undefined;
  houseAddons?: Array<string> | undefined;
}
export interface EditReservation {
  from?: string | undefined;
  to?: string | undefined;
  guests: number;
  message?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  status?: ReservationStatus | undefined;
  address?: string | undefined;
  houseAddons?: Array<string> | undefined;
}
export interface CreateHouse {
  name: string;
  outOfSeasonPrice: number;
  addons?: Array<string> | undefined;
  text?: RichText | undefined;
}
export interface CreatePricingRule {
  maxDays: number;
  price: number;
  season: string;
}
export interface CreateSeason {
  from: string;
  to: string;
  name: string;
}
export interface EditHouse {
  name?: string | undefined;
  outOfSeasonPrice?: number | undefined;
  addons?: Array<string> | undefined;
  text?: RichText | undefined;
}
export interface EditPricingRule {
  maxDays?: number | undefined;
  price?: number | undefined;
  season?: string | undefined;
}
export interface EditSeason {
  from?: string | undefined;
  to?: string | undefined;
  name?: string | undefined;
}
export interface CreatePaymentSessionInput {
  amount: number;
  currency: string;
  successUrl: string;
  cancelUrl: string;
}
export interface CreateHouseAddon {
  name: string;
  price: number;
  perDay?: boolean | undefined;
}
export interface UpdateHouseAddon {
  name?: string | undefined;
  price?: number | undefined;
  perDay?: boolean | undefined;
}
export interface CreateLandingPage {
  domain?: string | undefined;
  slug: string;
  description: string;
  generatedCode?: GeneratedCode | undefined;
}
export interface UpdateLandingPage {
  domain?: string | undefined;
  slug?: string | undefined;
  description?: string | undefined;
}

export type Models = {
  ['PricingRule']: {
    maxDays: {
      args: Record<string, never>;
    };
    price: {
      args: Record<string, never>;
    };
    season: {
      args: Record<string, never>;
    };
    _id: {
      args: Record<string, never>;
    };
    house: {
      args: Record<string, never>;
    };
  };
  ['Season']: {
    from: {
      args: Record<string, never>;
    };
    to: {
      args: Record<string, never>;
    };
    name: {
      args: Record<string, never>;
    };
    _id: {
      args: Record<string, never>;
    };
  };
  ['HousePublicQuery']: {
    house: {
      args: Record<string, never>;
    };
    getPrice: {
      args: {
        period: DeterminePrice;
      };
    };
    getAvailability: {
      args: {
        year: number;
      };
    };
  };
  ['Reservation']: {
    price: {
      args: Record<string, never>;
    };
    from: {
      args: Record<string, never>;
    };
    to: {
      args: Record<string, never>;
    };
    _id: {
      args: Record<string, never>;
    };
    house: {
      args: Record<string, never>;
    };
    paid: {
      args: Record<string, never>;
    };
    guests: {
      args: Record<string, never>;
    };
    message: {
      args: Record<string, never>;
    };
    firstName: {
      args: Record<string, never>;
    };
    lastName: {
      args: Record<string, never>;
    };
    phone: {
      args: Record<string, never>;
    };
    email: {
      args: Record<string, never>;
    };
    status: {
      args: Record<string, never>;
    };
    address: {
      args: Record<string, never>;
    };
    houseAddons: {
      args: Record<string, never>;
    };
  };
  ['HousePublicMutation']: {
    reserve: {
      args: {
        reservation: CreateReservation;
      };
    };
  };
  ['Availability']: {
    date: {
      args: Record<string, never>;
    };
    booked: {
      args: Record<string, never>;
    };
    start: {
      args: Record<string, never>;
    };
    end: {
      args: Record<string, never>;
    };
    price: {
      args: Record<string, never>;
    };
  };
  ['Query']: {
    housePublic: {
      args: {
        id: string;
      };
    };
    houses: {
      args: Record<string, never>;
    };
  };
  ['Mutation']: {
    housePublic: {
      args: {
        id: string;
      };
    };
    createPaymentSession: {
      args: {
        payload: CreatePaymentSessionInput;
      };
    };
  };
  ['AdminMutation']: {
    createSeason: {
      args: {
        season: CreateSeason;
      };
    };
    createHouse: {
      args: {
        house: CreateHouse;
      };
    };
    houseOps: {
      args: {
        _id: string;
      };
    };
    seasonOps: {
      args: {
        _id: string;
      };
    };
    reservationOps: {
      args: {
        _id: string;
      };
    };
    createHouseAddon: {
      args: {
        addon: CreateHouseAddon;
      };
    };
    addonOps: {
      args: {
        _id: string;
      };
    };
    createLandingPage: {
      args: {
        landingPage: CreateLandingPage;
      };
    };
    landingPageOps: {
      args: {
        _id: string;
      };
    };
  };
  ['AdminHouseOps']: {
    delete: {
      args: Record<string, never>;
    };
    update: {
      args: {
        house: EditHouse;
      };
    };
    pricingRuleOps: {
      args: {
        _id: string;
      };
    };
    createPricingRule: {
      args: {
        pricingRule: CreatePricingRule;
      };
    };
  };
  ['SeasonOps']: {
    delete: {
      args: Record<string, never>;
    };
    edit: {
      args: {
        season: EditSeason;
      };
    };
  };
  ['PricingRuleOps']: {
    delete: {
      args: Record<string, never>;
    };
    update: {
      args: {
        pricingRule: EditPricingRule;
      };
    };
  };
  ['House']: {
    _id: {
      args: Record<string, never>;
    };
    name: {
      args: Record<string, never>;
    };
    outOfSeasonPrice: {
      args: Record<string, never>;
    };
    owner: {
      args: Record<string, never>;
    };
    addons: {
      args: Record<string, never>;
    };
    text: {
      args: Record<string, never>;
    };
  };
  ['AdminQuery']: {
    houses: {
      args: Record<string, never>;
    };
    houseById: {
      args: {
        _id: string;
      };
    };
    reservations: {
      args: Record<string, never>;
    };
    seasons: {
      args: Record<string, never>;
    };
    pricingRules: {
      args: Record<string, never>;
    };
    me: {
      args: Record<string, never>;
    };
    addons: {
      args: Record<string, never>;
    };
    pages: {
      args: Record<string, never>;
    };
  };
  ['AuthorizedUserQuery']: {
    admin: {
      args: Record<string, never>;
    };
  };
  ['User']: {
    _id: {
      args: Record<string, never>;
    };
  };
  ['ReservationOps']: {
    delete: {
      args: Record<string, never>;
    };
    update: {
      args: {
        reservation: EditReservation;
      };
    };
  };
  ['AuthorizedUserMutation']: {
    admin: {
      args: Record<string, never>;
    };
  };
  ['HouseAddon']: {
    name: {
      args: Record<string, never>;
    };
    price: {
      args: Record<string, never>;
    };
    _id: {
      args: Record<string, never>;
    };
    perDay: {
      args: Record<string, never>;
    };
  };
  ['HouseAddonOps']: {
    update: {
      args: {
        addon: UpdateHouseAddon;
      };
    };
    delete: {
      args: Record<string, never>;
    };
  };
  ['LandingPage']: {
    houses: {
      args: Record<string, never>;
    };
    domain: {
      args: Record<string, never>;
    };
    slug: {
      args: Record<string, never>;
    };
    description: {
      args: Record<string, never>;
    };
    generatedCode: {
      args: Record<string, never>;
    };
  };
  ['LandingPageOps']: {
    delete: {
      args: Record<string, never>;
    };
    update: {
      args: {
        landingPage: UpdateLandingPage;
      };
    };
  };
};

export type Directives = unknown;

export interface Nameable {
  name: string;
}
export interface WithId {
  _id: string;
}

export type Scalars = {
  ['RichText']: unknown;
  ['GeneratedCode']: unknown;
};

export interface PricingRule {
  maxDays: number;
  price: number;
  season: Season;
  _id: string;
  house: House;
}
export interface Season {
  from: string;
  to: string;
  name: string;
  _id: string;
}
export interface HousePublicQuery {
  house: House;
  getPrice: number;
  getAvailability: Array<Availability>;
}
export interface Reservation {
  price: number;
  from: string;
  to: string;
  _id: string;
  house: House;
  paid?: boolean | undefined;
  guests: number;
  message?: string | undefined;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  status: ReservationStatus;
  address?: string | undefined;
  houseAddons?: Array<HouseAddon> | undefined;
}
export interface HousePublicMutation {
  reserve?: string | undefined;
}
export interface Availability {
  date: string;
  booked?: boolean | undefined;
  start?: boolean | undefined;
  end?: boolean | undefined;
  price: number;
}
export interface Query {
  housePublic?: HousePublicQuery | undefined;
  houses: Array<House>;
}
export interface Mutation {
  housePublic?: HousePublicMutation | undefined;
  createPaymentSession: string;
}
export interface AdminMutation {
  createSeason?: string | undefined;
  createHouse?: string | undefined;
  houseOps?: AdminHouseOps | undefined;
  seasonOps?: SeasonOps | undefined;
  reservationOps?: ReservationOps | undefined;
  createHouseAddon?: string | undefined;
  addonOps?: HouseAddonOps | undefined;
  createLandingPage?: string | undefined;
  landingPageOps?: LandingPageOps | undefined;
}
export interface AdminHouseOps {
  delete?: boolean | undefined;
  update?: boolean | undefined;
  pricingRuleOps?: PricingRuleOps | undefined;
  createPricingRule?: string | undefined;
}
export interface SeasonOps {
  delete?: boolean | undefined;
  edit?: boolean | undefined;
}
export interface PricingRuleOps {
  delete?: boolean | undefined;
  update?: boolean | undefined;
}
export interface House {
  _id: string;
  name: string;
  outOfSeasonPrice: number;
  owner: User;
  addons?: Array<HouseAddon> | undefined;
  text?: RichText | undefined;
}
export interface AdminQuery {
  houses: Array<House>;
  houseById?: House | undefined;
  reservations: Array<Reservation>;
  seasons: Array<Season>;
  pricingRules: Array<PricingRule>;
  me: User;
  addons?: Array<HouseAddon> | undefined;
  pages?: Array<LandingPage> | undefined;
}
export interface AuthorizedUserQuery {
  admin?: AdminQuery | undefined;
}
export interface User {
  _id: string;
}
export interface ReservationOps {
  delete?: boolean | undefined;
  update?: boolean | undefined;
}
export interface AuthorizedUserMutation {
  admin?: AdminMutation | undefined;
}
export interface HouseAddon {
  name: string;
  price: number;
  _id: string;
  perDay?: boolean | undefined;
}
export interface HouseAddonOps {
  update?: boolean | undefined;
  delete?: boolean | undefined;
}
export interface LandingPage {
  houses?: Array<House> | undefined;
  domain?: string | undefined;
  slug: string;
  description: string;
  generatedCode?: GeneratedCode | undefined;
}
export interface LandingPageOps {
  delete?: boolean | undefined;
  update?: boolean | undefined;
}
