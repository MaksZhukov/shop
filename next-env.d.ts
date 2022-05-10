/// <reference types="next" />
/// <reference types="next/image-types/global" />

import { AxiosError } from 'axios';

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.

declare module 'axios' {
    interface ErrorResponse {
        data: null;
        error: {
            details: any;
            message: string;
            name: ErrorTypes;
            status: number;
        };
    }

    interface AxiosStatic {
        isAxiosError(payload: any): payload is AxiosError<ErrorResponse>;
    }
}
