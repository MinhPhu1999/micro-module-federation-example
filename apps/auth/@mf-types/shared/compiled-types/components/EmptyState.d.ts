import type { ReactNode } from 'react';
import '../index.css';
interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}
export declare const EmptyState: ({ icon, title, description, action }: EmptyStateProps) => import("react").JSX.Element;
export {};
