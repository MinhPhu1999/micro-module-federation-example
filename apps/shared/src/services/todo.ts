import apiClient from '@/api/client'
import { TODO_ENDPOINTS } from '@/api/endpoints'
import type {
  CreateTodoRequest,
  UpdateTodoRequest,
  Todo,
  TodoListParams,
  TodoStats,
  ApiSuccess,
  ApiListResponse,
  ApiMessageResponse,
  BulkCreateTodosRequest,
  BulkUpdateTodosRequest,
  BulkDeleteTodosRequest,
  BulkDeleteResult,
} from '@/types'

export const todoApi = {
  list: (params?: TodoListParams) =>
    apiClient.get<ApiListResponse<Todo>>(TODO_ENDPOINTS.list(), { params }),

  getById: (id: string) =>
    apiClient.get<ApiSuccess<Todo>>(TODO_ENDPOINTS.getById(id)),

  create: (data: CreateTodoRequest) =>
    apiClient.post<ApiSuccess<Todo>>(TODO_ENDPOINTS.create(), data),

  update: (id: string, data: UpdateTodoRequest) =>
    apiClient.patch<ApiSuccess<Todo>>(TODO_ENDPOINTS.update(id), data),

  delete: (id: string) =>
    apiClient.delete<ApiMessageResponse>(TODO_ENDPOINTS.delete(id)),

  restore: (id: string) =>
    apiClient.post<ApiSuccess<Todo>>(TODO_ENDPOINTS.restore(id)),

  bulkCreate: (data: BulkCreateTodosRequest) =>
    apiClient.post<ApiSuccess<Todo[]>>(TODO_ENDPOINTS.bulkCreate(), data),

  bulkUpdate: (data: BulkUpdateTodosRequest) =>
    apiClient.patch<ApiSuccess<Todo[]>>(TODO_ENDPOINTS.bulkUpdate(), data),

  bulkDelete: (data: BulkDeleteTodosRequest) =>
    apiClient.delete<ApiSuccess<BulkDeleteResult>>(TODO_ENDPOINTS.bulkDelete(), { data }),

  stats: () =>
    apiClient.get<ApiSuccess<TodoStats>>(TODO_ENDPOINTS.stats()),
}
