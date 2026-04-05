import { api } from 'shared/api';
import { AuthResponse, User } from './model/userModel';

export const userApi = {
	login: (email: string, password: string, recaptchaToken?: string) =>
		api.post<AuthResponse>('auth/local', {
			identifier: email,
			password,
			recaptchaToken
		}),
	logout: () => api.post('auth/logout'),
	register: (email: string, password: string, recaptchaToken?: string) =>
		api.post<AuthResponse>('auth/local/register', {
			username: email,
			email,
			password,
			recaptchaToken
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
	getUserInfo: () => api.get<User>('/users/me'),
	updateUserInfo: (data: { username: string; phone: string; address: string }) => api.put('/users/me', data)
};
