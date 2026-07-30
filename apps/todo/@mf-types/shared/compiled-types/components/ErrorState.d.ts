import '../index.css';
interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}
export declare const ErrorState: ({ title, message, onRetry }: ErrorStateProps) => import("react").JSX.Element;
export {};
