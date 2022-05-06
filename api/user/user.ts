import { api } from '..';
import { AuthResponse } from './types';

export const login = (email: string, password: string) =>
    api.post<AuthResponse>('auth/local', {
        identifier: email,
        password,
    });

export const register = (email: string, password: string) =>
    api.post<AuthResponse>('auth/local/register', {
        email,
        password,
    });
