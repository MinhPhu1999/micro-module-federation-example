import type { ReactNode } from 'react';
import '../index.css';
export interface Column<T> {
    key: string;
    header: string;
    render?: (row: T) => ReactNode;
    sortable?: boolean;
    width?: string;
}
interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    onSort?: (key: string) => void;
    sortKey?: string;
    sortDir?: 'asc' | 'desc';
    isLoading?: boolean;
}
export declare function Table<T extends Record<string, unknown>>({ columns, data, onSort, sortKey, sortDir, isLoading, }: TableProps<T>): import("react").JSX.Element;
export {};
