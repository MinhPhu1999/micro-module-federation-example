import apiClient from '@/api/client'
import { TODO_ENDPOINTS } from '@/api/endpoints'
import type { CreateTodoRequest, UpdateTodoRequest, Todo, TodoListParams, ApiSuccess, ApiListResponse } from '@/types'

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
    apiClient.delete<ApiSuccess<{ message: string }>>(TODO_ENDPOINTS.delete(id)),
}
