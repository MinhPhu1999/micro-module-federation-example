export type TodoPriority = 'low' | 'medium' | 'high'
export type TodoSortBy = 'created_at' | 'due_at' | 'priority' | 'title'
export type TodoSortOrder = 'asc' | 'desc'

export interface Todo {
  id: string
  title: string
  description?: string
  priority: TodoPriority
  tags: string[]
  due_at: string | null
  completed: boolean
  created_at: string
  updated_at: string
  completed_at: string | null
  deleted_at: string | null
}

export interface CreateTodoRequest {
  title: string
  description?: string
  priority?: TodoPriority
  tags?: string[]
  due_at?: string | null
}

export interface UpdateTodoRequest {
  title?: string
  description?: string
  priority?: TodoPriority
  tags?: string[]
  due_at?: string | null
  completed?: boolean
}

export interface TodoListParams {
  pageSize?: number
  pageNumber?: number
  completed?: boolean
  search?: string
  priority?: TodoPriority
  tags?: string
  dueFrom?: string
  dueTo?: string
  sortBy?: TodoSortBy
  sortOrder?: TodoSortOrder
  includeDeleted?: boolean
}

export interface TodoStats {
  total: number
  completed: number
  pending: number
  overdue: number
  completion_rate: number
}

export interface BulkCreateTodosRequest {
  todos: CreateTodoRequest[]
}

export type BulkUpdateTodoItem = UpdateTodoRequest & { id: string }

export interface BulkUpdateTodosRequest {
  todos: BulkUpdateTodoItem[]
}

export interface BulkDeleteTodosRequest {
  ids: string[]
}

export interface BulkDeleteResult {
  deleted: number
}
