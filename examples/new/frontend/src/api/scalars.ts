import { GraphQLTypes, ZeusScalars, FromSelector as BaseFromSelector } from '@/zeus/index.ts';

export const scalars = ZeusScalars({
  ID: {
    decode: (e: unknown) => e as string,
    encode: (e: unknown) => JSON.stringify(e),
  },
});

type ScalarsType = typeof scalars;
export type FromSelector<SELECTOR, NAME extends keyof GraphQLTypes> = BaseFromSelector<SELECTOR, NAME, ScalarsType>;
