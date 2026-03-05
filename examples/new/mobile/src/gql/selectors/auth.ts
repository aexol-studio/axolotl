import { Selector } from '../../zeus'

export const authUserSelector = Selector('User')({
  _id: true,
  email: true,
  createdAt: true,
})

export const authorizedUserMeSelector = Selector('AuthorizedUserQuery')({
  me: authUserSelector,
})
