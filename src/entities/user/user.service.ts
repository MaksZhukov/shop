import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { USER_API, UserApi } from './user.api';
import type { UserReader } from './ports/user.port';

@injectable()
export class UserService implements UserReader {
	constructor(@inject(USER_API) private readonly userApi: UserApi) {}

	login(email: string, password: string, recaptchaToken?: string) {
		return this.userApi.login(email, password, recaptchaToken);
	}

	logout() {
		return this.userApi.logout();
	}

	register(email: string, password: string, recaptchaToken?: string) {
		return this.userApi.register(email, password, recaptchaToken);
	}

	forgotPassword(email: string) {
		return this.userApi.forgotPassword(email);
	}

	resetPassword(code: string, password: string, passwordConfirmation: string) {
		return this.userApi.resetPassword(code, password, passwordConfirmation);
	}

	getUserInfo() {
		return this.userApi.getUserInfo();
	}

	updateUserInfo(data: { username: string; phone: string; address: string }) {
		return this.userApi.updateUserInfo(data);
	}
}
