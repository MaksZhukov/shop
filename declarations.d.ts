import axios, { AxiosError } from 'axios';

declare module 'axios' {
    interface Error {
        error: { status: number; message: string; name: string };
    }
    export interface AxiosStatic {
        isAxiosError(payload: any): payload is AxiosError<Error>;
    }
    export default axios;
}

declare global {
    class BeGateway {
        constructor(params: any);
        createWidget();
    }
}
