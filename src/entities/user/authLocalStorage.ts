import { BaseStorageService } from 'shared/services';

export class AuthLocalStorage extends BaseStorageService {
	private readonly TOKEN_KEY = 'token';

	saveJwt(jwt: string): void {
		this.setItem(this.TOKEN_KEY, jwt);
	}

	getJwt(): string | null {
		return this.getItem(this.TOKEN_KEY, null);
	}

	removeJwt(): void {
		this.removeItem(this.TOKEN_KEY);
	}

	hasJwt(): boolean {
		return this.hasItem(this.TOKEN_KEY);
	}
}

export const authLocalStorage = new AuthLocalStorage();
