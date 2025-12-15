import { api } from 'shared/api';
import { AuthResponse } from './userTypes';

export const userApi = {
	login: (email: string, password: string) =>
		api.post<AuthResponse>('auth/local', {
			identifier: email,
			password
		}),
	register: (email: string, password: string) =>
		api.post<AuthResponse>('auth/local/register', {
			username: email,
			email,
			password
		}),
	forgotPassword: (email: string) =>
		api.post('auth/forgot-password', {
			email
		}),
	resetPassword: (code: string, password: string, passwordConfirmation: string) =>
		api.post('/auth/reset-password', {
			code,
			password,
			passwordConfirmation: passwordConfirmation
		}),
	getUserInfo: () => api.get('/users/me'),
	updateUserInfo: (data: { username: string; phone: string; address: string }) => api.put('/users/me', data)
};
