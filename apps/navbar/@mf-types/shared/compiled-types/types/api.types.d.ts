export type ErrorCode = 'BAD_REQUEST' | 'UNAUTHORIZED' | 'EMAIL_ALREADY_EXISTS' | 'ACCOUNT_LOCKED' | 'TODO_NOT_FOUND' | 'INVALID_REFRESH_TOKEN' | 'GOOGLE_AUTH_UNAVAILABLE' | 'GOOGLE_PROFILE_UNAVAILABLE' | 'INTERNAL_SERVER_ERROR';
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}
export interface ApiSuccess<T> {
    success: true;
    message?: string;
    data: T;
}
export interface ApiListResponse<T> {
    success: true;
    data: T[];
    meta: PaginationMeta;
}
export interface ApiError {
    success: false;
    error: {
        code: ErrorCode;
        message: string;
        details?: string;
    };
}
export type ApiResponse<T> = ApiSuccess<T> | ApiListResponse<T> | ApiError;
