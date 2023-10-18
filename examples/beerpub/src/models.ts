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
      args: never;
    };
    price: {
      args: never;
    };
    _id: {
      args: never;
    };
    createdAt: {
      args: never;
    };
  };
  ['Query']: {
    beers: {
      args: never;
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
