import { Selector } from '../../zeus'

export const todoItemSelector = Selector('Todo')({
  _id: true,
  content: true,
  done: true,
})

export const authorizedUserTodosSelector = Selector('AuthorizedUserQuery')({
  todos: todoItemSelector,
})

export const todoOpsSelector = Selector('TodoOps')({
  markDone: true,
})
