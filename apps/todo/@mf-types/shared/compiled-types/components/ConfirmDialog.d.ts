import '../index.css';
interface ConfirmDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'primary';
}
export declare const ConfirmDialog: ({ isOpen, onConfirm, onCancel, title, message, confirmLabel, cancelLabel, variant, }: ConfirmDialogProps) => import("react").JSX.Element;
export {};
