import 'reflect-metadata';
import { atom, computed } from '@reatom/core';
import { injectable } from 'inversify';

/** The signed-in user id, without the profile. Entities read it instead of depending on the user entity. */
@injectable()
export class SessionStore {
	readonly userId = atom<number | null>(null, 'session.userId');
	readonly isAuth = computed(() => this.userId() !== null, 'session.isAuth');

	set(userId: number) {
		this.userId.set(userId);
	}

	clear() {
		this.userId.set(null);
	}
}
