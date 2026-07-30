import { type TextareaHTMLAttributes } from 'react';
import '../index.css';
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}
export declare const TextArea: import("react").ForwardRefExoticComponent<TextAreaProps & import("react").RefAttributes<HTMLTextAreaElement>>;
export {};
