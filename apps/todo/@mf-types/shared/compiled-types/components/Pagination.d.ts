import '../index.css';
interface PaginationProps {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}
export declare const Pagination: ({ page, limit: _limit, total: _total, totalPages, onPageChange }: PaginationProps) => import("react").JSX.Element | null;
export {};
