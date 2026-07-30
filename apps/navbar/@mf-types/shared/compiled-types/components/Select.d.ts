import { type SelectHTMLAttributes } from 'react';
import '../index.css';
interface SelectOption {
    value: string;
    label: string;
}
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: SelectOption[];
}
export declare const Select: import("react").ForwardRefExoticComponent<SelectProps & import("react").RefAttributes<HTMLSelectElement>>;
export {};
