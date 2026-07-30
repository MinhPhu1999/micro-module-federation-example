export interface User {
    id: string;
    email: string;
    name?: string;
    picture?: string;
    providers: string[];
    created_at: string;
    updated_at: string;
    last_login_at: string | null;
}
export interface AuthPayload {
    token_type: string;
    access_token: string;
    refresh_token: string;
    expires_at: string;
    user: User;
}
export interface RegisterRequest {
    email: string;
    password: string;
    name?: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface ForgotPasswordRequest {
    email: string;
}
export interface ResetPasswordRequest {
    email: string;
    otp: string;
    new_password: string;
}
export interface RefreshTokenRequest {
    refresh_token: string;
}
