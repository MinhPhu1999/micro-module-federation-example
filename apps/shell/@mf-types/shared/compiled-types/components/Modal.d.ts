import { type ReactNode } from 'react';
import '../index.css';
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg';
}
export declare const Modal: ({ isOpen, onClose, title, children, size }: ModalProps) => import("react").JSX.Element | null;
export {};
