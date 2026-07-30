import { type ReactNode } from 'react';
import '../index.css';
interface DropdownItem {
    value: string;
    label: string;
    icon?: ReactNode;
}
interface DropdownProps {
    trigger: ReactNode;
    items: DropdownItem[];
    onSelect: (value: string) => void;
    align?: 'left' | 'right';
}
export declare const Dropdown: ({ trigger, items, onSelect, align }: DropdownProps) => import("react").JSX.Element;
export {};
