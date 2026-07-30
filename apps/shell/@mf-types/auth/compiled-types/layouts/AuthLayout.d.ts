import type { ReactNode } from 'react';
interface AuthLayoutProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
}
export declare const AuthLayout: ({ title, subtitle, children }: AuthLayoutProps) => import("react").JSX.Element;
export {};
