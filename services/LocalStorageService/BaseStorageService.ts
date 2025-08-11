export abstract class BaseStorageService {
	protected isClient(): boolean {
		return typeof window !== 'undefined' && !!window.localStorage;
	}

	protected getItem<T>(key: string, defaultValue: T): T {
		if (!this.isClient()) return defaultValue;

		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : defaultValue;
		} catch (error) {
			console.error(`Error reading from localStorage key "${key}":`, error);
			return defaultValue;
		}
	}

	protected setItem<T>(key: string, value: T): void {
		if (!this.isClient()) return;

		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error(`Error writing to localStorage key "${key}":`, error);
		}
	}

	protected removeItem(key: string): void {
		if (!this.isClient()) return;

		try {
			localStorage.removeItem(key);
		} catch (error) {
			console.error(`Error removing localStorage key "${key}":`, error);
		}
	}

	protected hasItem(key: string): boolean {
		if (!this.isClient()) return false;

		try {
			return localStorage.getItem(key) !== null;
		} catch (error) {
			console.error(`Error checking localStorage key "${key}":`, error);
			return false;
		}
	}
}
