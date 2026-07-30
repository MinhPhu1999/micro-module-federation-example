import type { CreateTodoRequest, UpdateTodoRequest, Todo, TodoListParams, ApiSuccess, ApiListResponse } from '@/types';
export declare const todoApi: {
    list: (params?: TodoListParams) => Promise<import("axios").AxiosResponse<ApiListResponse<Todo>, any, {}>>;
    getById: (id: string) => Promise<import("axios").AxiosResponse<ApiSuccess<Todo>, any, {}>>;
    create: (data: CreateTodoRequest) => Promise<import("axios").AxiosResponse<ApiSuccess<Todo>, any, {}>>;
    update: (id: string, data: UpdateTodoRequest) => Promise<import("axios").AxiosResponse<ApiSuccess<Todo>, any, {}>>;
    delete: (id: string) => Promise<import("axios").AxiosResponse<ApiSuccess<{
        message: string;
    }>, any, {}>>;
};
