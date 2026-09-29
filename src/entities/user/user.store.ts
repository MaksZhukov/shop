import 'reflect-metadata';
import { atom } from '@reatom/core';
import { injectable } from 'inversify';

type SessionUser = {
	id: number | null;
	email: string;
	username: string;
	phone: string;
	address: string;
};

const emptyUser: SessionUser = {
	id: null,
	email: '',
	username: '',
	phone: '',
	address: ''
};

@injectable()
export class UserStore {
	private readonly userAtom = atom<SessionUser>(emptyUser, 'user');
	private readonly isInitialRequestDoneAtom = atom(false, 'user.isInitialRequestDone');

	get id() {
		return this.userAtom().id;
	}
	get email() {
		return this.userAtom().email;
	}
	get username() {
		return this.userAtom().username;
	}
	get phone() {
		return this.userAtom().phone;
	}
	get address() {
		return this.userAtom().address;
	}
	get isInitialRequestDone() {
		return this.isInitialRequestDoneAtom();
	}
	setId(id: number) {
		this.userAtom.set((user) => ({ ...user, id }));
	}
	setEmail(email: string) {
		this.userAtom.set((user) => ({ ...user, email }));
	}
	setUsername(username: string) {
		this.userAtom.set((user) => ({ ...user, username }));
	}
	setPhone(phone: string) {
		this.userAtom.set((user) => ({ ...user, phone }));
	}
	setAddress(address: string) {
		this.userAtom.set((user) => ({ ...user, address }));
	}
	setUser(user: { id: number; email: string; username: string; phone: string; address: string }) {
		this.userAtom.set(user);
	}
	clearUser() {
		this.userAtom.set(emptyUser);
	}
	setIsInitialRequestDone() {
		this.isInitialRequestDoneAtom.set(true);
	}
}
