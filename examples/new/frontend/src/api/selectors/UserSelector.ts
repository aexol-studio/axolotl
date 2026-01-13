import { Selector } from '@/zeus/index.ts';
import { FromSelector } from '../scalars.ts';

export const UserSelector = Selector('User')({ id: true, name: true });

export type UserType = FromSelector<typeof UserSelector, 'User'>;
