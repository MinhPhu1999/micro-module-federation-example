import '../index.css';
interface SkeletonProps {
    width?: string;
    height?: string;
    variant?: 'text' | 'circle' | 'rect';
    className?: string;
}
export declare const Skeleton: ({ width, height, variant, className }: SkeletonProps) => import("react").JSX.Element;
export {};
