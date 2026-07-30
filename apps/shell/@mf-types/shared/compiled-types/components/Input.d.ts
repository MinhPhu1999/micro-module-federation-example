import { type InputHTMLAttributes } from 'react';
import '../index.css';
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}
export declare const Input: import("react").ForwardRefExoticComponent<InputProps & import("react").RefAttributes<HTMLInputElement>>;
export {};
