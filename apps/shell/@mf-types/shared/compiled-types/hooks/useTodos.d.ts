import type { TodoListParams } from '@/types';
export declare const todoKeys: {
    all: readonly ["todos"];
    lists: () => readonly ["todos", "list"];
    list: (params?: TodoListParams) => readonly ["todos", "list", TodoListParams | undefined];
    details: () => readonly ["todos", "detail"];
    detail: (id: string) => readonly ["todos", "detail", string];
};
export declare function useTodos(params?: TodoListParams): import("@tanstack/react-query").UseQueryResult<NoInfer<{
    todos: import("@/types").Todo[];
    meta: import("@/types").PaginationMeta;
}>, Error>;
