import { api } from '..';
import { AuthResponse } from './types';

export const login = (email: string, password: string) =>
	api.post<AuthResponse>('auth/local', {
		identifier: email,
		password,
	});

export const register = (email: string, password: string) =>
	api.post<AuthResponse>('auth/local/register', {
		username: email,
		email,
		password,
	});

export const forgotPassword = (email: string) =>
	api.post('auth/forgot-password', {
		email,
	});

export const resetPassword = (
	code: string,
	password: string,
	passwordConfirmation: string
) =>
	api.post('/auth/reset-password', {
		code,
		password,
		passwordConfirmation: passwordConfirmation,
	});

export const getUserInfo = () => api.get('/users/me');

export const updateUserInfo = (data: {
	username: string;
	phone: string;
	address: string;
}) => api.put('/users/me', data);
