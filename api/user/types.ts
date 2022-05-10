export interface AuthResponse {
    jwt: string;
    user: {
        id: string;
        email: string;
    };
}
