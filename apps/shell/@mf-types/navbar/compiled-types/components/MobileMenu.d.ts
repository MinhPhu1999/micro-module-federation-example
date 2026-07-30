interface MobileMenuProps {
    isAuthenticated: boolean;
    user: {
        name?: string;
        email?: string;
        picture?: string;
    } | null;
    onNavigate: (path: string) => void;
    onLogout: () => void;
}
export declare const MobileMenu: ({ isAuthenticated, user, onNavigate, onLogout }: MobileMenuProps) => import("react").JSX.Element;
export {};
