import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import { AuthResponse, User } from './model/user.model';

export const USER_API = Symbol('UserApi');

@injectable()
export class UserApi {
	login(email: string, password: string, recaptchaToken?: string) {
		return api.post<AuthResponse>('auth/local', {
			identifier: email,
			password,
			recaptchaToken
		});
	}

	logout() {
		return api.post('auth/logout');
	}

	register(email: string, password: string, recaptchaToken?: string) {
		return api.post<AuthResponse>('auth/local/register', {
			username: email,
			email,
			password,
			recaptchaToken
		});
	}

	forgotPassword(email: string) {
		return api.post('auth/forgot-password', {
			email
		});
	}

	resetPassword(code: string, password: string, passwordConfirmation: string) {
		return api.post('/auth/reset-password', {
			code,
			password,
			passwordConfirmation: passwordConfirmation
		});
	}

	getUserInfo() {
		return api.get<User>('/users/me');
	}

	updateUserInfo(data: { username: string; phone: string; address: string }) {
		return api.put('/users/me', data);
	}
}

export const userApi = new UserApi();

