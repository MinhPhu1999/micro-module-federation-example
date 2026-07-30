import { type InputHTMLAttributes } from 'react';
import '../index.css';
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    error?: string;
}
export declare const Checkbox: import("react").ForwardRefExoticComponent<CheckboxProps & import("react").RefAttributes<HTMLInputElement>>;
export {};
