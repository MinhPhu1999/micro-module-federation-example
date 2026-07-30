import type { Todo } from 'shared/types';
interface TodoTableProps {
    todos: Todo[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}
export declare const TodoTable: ({ todos, onEdit, onDelete }: TodoTableProps) => import("react").JSX.Element;
export {};
