export interface User {
	id: number;
	email: string;
	username: string;
	phone: string;
	address: string;
}

export interface AuthResponse {
	jwt: string;
	user: User;
}
