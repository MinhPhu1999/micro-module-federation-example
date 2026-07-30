import type { UpdateTodoRequest } from '@/types';
export declare function useUpdateTodo(): import("@tanstack/react-query").UseMutationResult<import("@/types").ApiSuccess<import("@/types").Todo>, Error, {
    id: string;
    data: UpdateTodoRequest;
}, unknown>;
