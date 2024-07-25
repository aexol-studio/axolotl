import { createResolvers } from '@/src/modules/users/axolotl.js';
import Query from '@/src/modules/users/resolvers/Query/Query.js';
import Mutation from '@/src/modules/users/resolvers/Mutation/Mutation.js';
import UsersQuery from '@/src/modules/users/resolvers/UsersQuery/UsersQuery.js';
import UsersMutation from '@/src/modules/users/resolvers/UsersMutation/UsersMutation.js';
import AuthorizedUserQuery from '@/src/modules/users/resolvers/AuthorizedUserQuery/AuthorizedUserQuery.js';
import PublicUsersQuery from '@/src/modules/users/resolvers/PublicUsersQuery/PublicUsersQuery.js';
import AuthorizedUserMutation from '@/src/modules/users/resolvers/AuthorizedUserMutation/AuthorizedUserMutation.js';
import PublicUsersMutation from '@/src/modules/users/resolvers/PublicUsersMutation/PublicUsersMutation.js';
import LoginQuery from '@/src/modules/users/resolvers/LoginQuery/LoginQuery.js';
import ProviderLoginQuery from '@/src/modules/users/resolvers/ProviderLoginQuery/ProviderLoginQuery.js';

export default (fns: Parameters<typeof PublicUsersMutation>[0] & Parameters<typeof PublicUsersQuery>[0]) =>
  createResolvers({
    ...Query,
    ...Mutation,
    ...UsersQuery,
    ...UsersMutation,
    ...AuthorizedUserQuery,
    ...PublicUsersQuery({ ...fns }),
    ...AuthorizedUserMutation,
    ...PublicUsersMutation({ ...fns }),
    ...LoginQuery,
    ...ProviderLoginQuery,
  });
