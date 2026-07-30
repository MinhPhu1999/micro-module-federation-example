export interface Todo {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
    completed_at: string | null;
}
export interface CreateTodoRequest {
    title: string;
    description?: string;
}
export interface UpdateTodoRequest {
    title?: string;
    description?: string;
    completed?: boolean;
}
export interface TodoListParams {
    pageSize?: number;
    pageNumber?: number;
    completed?: boolean;
    search?: string;
}
