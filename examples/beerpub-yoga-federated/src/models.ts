export interface CreateBeer {
  name: string;
}
export interface UpdateBeer {
  name?: string | undefined;
}

export type Models = {
  ['Query']: {
    beers: {
      args: Record<string, never>;
    };
  };
  ['Beer']: {
    name: {
      args: Record<string, never>;
    };
    _id: {
      args: Record<string, never>;
    };
    createdAt: {
      args: Record<string, never>;
    };
    info: {
      args: Record<string, never>;
    };
    price: {
      args: Record<string, never>;
    };
  };
  ['Mutation']: {
    addBeer: {
      args: {
        beer: CreateBeer;
      };
    };
    deleteBeer: {
      args: {
        _id: string;
      };
    };
    updateBeer: {
      args: {
        beer: UpdateBeer;
        _id: string;
      };
    };
    setBeerPrice: {
      args: {
        _id: string;
        price?: number | undefined;
      };
    };
  };
};

export interface Query {
  beers?: Array<Beer> | undefined;
}
export interface Beer {
  name: string;
  _id: string;
  createdAt: string;
  info?: string | undefined;
  price?: number | undefined;
}
export interface Mutation {
  addBeer?: string | undefined;
  deleteBeer?: boolean | undefined;
  updateBeer?: boolean | undefined;
  setBeerPrice?: boolean | undefined;
}
