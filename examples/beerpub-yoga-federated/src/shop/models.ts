export type Models = {
  ['Beer']: {
    price: {
      args: Record<string, never>;
    };
    _id: {
      args: Record<string, never>;
    };
  };
  ['Mutation']: {
    setBeerPrice: {
      args: {
        _id: string;
        price?: number | undefined;
      };
    };
  };
};

export interface Beer {
  price?: number | undefined;
  _id: string;
}
export interface Mutation {
  setBeerPrice?: boolean | undefined;
}
