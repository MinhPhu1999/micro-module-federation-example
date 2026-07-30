import { type ReactNode } from 'react';
export type ToastType = 'success' | 'error' | 'warning' | 'info';
export interface Toast {
    id: string;
    type: ToastType;
    message: string;
}
interface ToastContextValue {
    toasts: Toast[];
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    info: (message: string) => void;
    removeToast: (id: string) => void;
}
export declare function ToastProvider({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare function useToast(): ToastContextValue;
export {};
