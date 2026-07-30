import { type ReactNode } from 'react';
import type { User, AuthPayload } from '@/types';
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
interface AuthContextValue extends AuthState {
    login: (payload: AuthPayload) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}
export declare function AuthProvider({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare function useAuth(): AuthContextValue;
export {};
