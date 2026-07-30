import type { ReactNode } from 'react';
import '../index.css';
interface CardProps {
    title?: string;
    children: ReactNode;
    className?: string;
    padding?: boolean;
}
export declare const Card: ({ title, children, className, padding }: CardProps) => import("react").JSX.Element;
export {};
