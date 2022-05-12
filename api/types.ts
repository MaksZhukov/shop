export const enum ErrorTypes {
    ValidationError = 'ValidationError',
}

export type ApiResponse<T = any> = {
    data: T;
    meta: {
        pagination?: {
            page: number;
            pageCount: number;
            pageSize: number;
            total: number;
        };
    };
};
