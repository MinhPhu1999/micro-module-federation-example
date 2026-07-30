import type { ReactNode, ButtonHTMLAttributes } from 'react';
import '../index.css';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children: ReactNode;
}
export declare const Button: ({ variant, size, isLoading, children, disabled, className, ...props }: ButtonProps) => import("react").JSX.Element;
export {};
