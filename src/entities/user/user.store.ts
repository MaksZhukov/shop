import { atom } from '@reatom/core';

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

const userAtom = atom<SessionUser>(emptyUser, 'user');
const isInitialRequestDoneAtom = atom(false, 'user.isInitialRequestDone');

export const userStore = {
	get id() {
		return userAtom().id;
	},
	get email() {
		return userAtom().email;
	},
	get username() {
		return userAtom().username;
	},
	get phone() {
		return userAtom().phone;
	},
	get address() {
		return userAtom().address;
	},
	get isInitialRequestDone() {
		return isInitialRequestDoneAtom();
	},
	setId(id: number) {
		userAtom.set((user) => ({ ...user, id }));
	},
	setEmail(email: string) {
		userAtom.set((user) => ({ ...user, email }));
	},
	setUsername(username: string) {
		userAtom.set((user) => ({ ...user, username }));
	},
	setPhone(phone: string) {
		userAtom.set((user) => ({ ...user, phone }));
	},
	setAddress(address: string) {
		userAtom.set((user) => ({ ...user, address }));
	},
	setUser(user: { id: number; email: string; username: string; phone: string; address: string }) {
		userAtom.set(user);
	},
	clearUser() {
		userAtom.set(emptyUser);
	},
	setIsInitialRequestDone() {
		isInitialRequestDoneAtom.set(true);
	}
};
