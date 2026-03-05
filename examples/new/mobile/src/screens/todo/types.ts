export type TodoFilter = 'all' | 'active' | 'completed'

export type TodoItem = {
  id: string
  title: string
  completed: boolean
  pendingSync?: boolean
}

export type TodoStats = {
  total: number
  active: number
  completed: number
}
