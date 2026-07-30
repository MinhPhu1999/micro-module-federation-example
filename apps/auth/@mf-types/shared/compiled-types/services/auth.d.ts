import type { RegisterRequest, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest, AuthPayload, ApiSuccess } from '@/types';
export declare const authApi: {
    register: (data: RegisterRequest) => Promise<import("axios").AxiosResponse<ApiSuccess<AuthPayload>, any, {}>>;
    login: (data: LoginRequest) => Promise<import("axios").AxiosResponse<ApiSuccess<AuthPayload>, any, {}>>;
    forgotPassword: (data: ForgotPasswordRequest) => Promise<import("axios").AxiosResponse<ApiSuccess<{
        message: string;
    }>, any, {}>>;
    resetPassword: (data: ResetPasswordRequest) => Promise<import("axios").AxiosResponse<ApiSuccess<{
        message: string;
    }>, any, {}>>;
    getGoogleUrl: () => Promise<import("axios").AxiosResponse<ApiSuccess<{
        url: string;
    }>, any, {}>>;
    googleCallback: (params: {
        state: string;
        code: string;
    }) => Promise<import("axios").AxiosResponse<ApiSuccess<AuthPayload>, any, {}>>;
    getMe: () => Promise<import("axios").AxiosResponse<ApiSuccess<import("@/types").User>, any, {}>>;
};
