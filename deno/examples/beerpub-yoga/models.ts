export interface CreateBeer {
  name: string;
  price: number;
}
export interface UpdateBeer {
  name?: string | undefined;
  price?: number | undefined;
}

export type Models = {
  ['Beer']: {
    name: {
      args: Record<string, never>;
    };
    price: {
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
  };
  ['Query']: {
    beers: {
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
  };
};

export type Directives = unknown

export interface Node {
  _id: string;
  createdAt: string;
}

export type Scalars = unknown;

export interface Beer {
  name: string;
  price: number;
  _id: string;
  createdAt: string;
  info?: string | undefined;
}
export interface Query {
  beers?: Array<Beer> | undefined;
}
export interface Mutation {
  addBeer?: string | undefined;
  deleteBeer?: boolean | undefined;
  updateBeer?: boolean | undefined;
}
