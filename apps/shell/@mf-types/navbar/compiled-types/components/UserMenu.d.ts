interface UserMenuProps {
    user: {
        name?: string;
        email?: string;
        picture?: string;
    } | null;
    onLogout: () => void;
}
export declare const UserMenu: ({ user, onLogout }: UserMenuProps) => import("react").JSX.Element;
export {};
