import { makeAutoObservable } from 'mobx';

export interface User {
	id: number | null;
	email: string;
}

export class UserStore implements User {
	id: number | null = null;
	email: string = '';
	username: string = '';
	phone: string = '';
	address: string = '';

	constructor() {
		makeAutoObservable(this);
	}

	setId(id: number) {
		this.id = id;
	}

	setEmail(email: string) {
		this.email = email;
	}

	setUsername(username: string) {
		this.username = username;
	}

	setPhone(phone: string) {
		this.phone = phone;
	}

	setAddress(address: string) {
		this.address = address;
	}

	setUser(user: { id: number; email: string; username: string; phone: string; address: string }) {
		this.id = user.id;
		this.email = user.email;
		this.username = user.username;
		this.phone = user.phone;
		this.address = user.address;
	}

	clearUser() {
		this.id = null;
		this.email = '';
		this.username = '';
		this.phone = '';
		this.address = '';
	}
}
