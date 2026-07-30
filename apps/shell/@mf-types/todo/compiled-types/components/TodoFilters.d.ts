interface TodoFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    completed: boolean | undefined;
    onCompletedChange: (value: boolean | undefined) => void;
}
export declare const TodoFilters: ({ search, onSearchChange, completed, onCompletedChange }: TodoFiltersProps) => import("react").JSX.Element;
export {};
