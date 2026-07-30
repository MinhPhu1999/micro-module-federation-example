export declare const API_PREFIX = "/api/v1";
export declare const AUTH_ENDPOINTS: {
    readonly register: () => string;
    readonly login: () => string;
    readonly forgotPassword: () => string;
    readonly resetPassword: () => string;
    readonly googleUrl: () => string;
    readonly googleCallback: () => string;
    readonly me: () => string;
    readonly refresh: () => string;
};
export declare const TODO_ENDPOINTS: {
    readonly list: () => string;
    readonly getById: (id: string) => string;
    readonly create: () => string;
    readonly update: (id: string) => string;
    readonly delete: (id: string) => string;
};
