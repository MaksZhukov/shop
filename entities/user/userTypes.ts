export interface AuthResponse {
	jwt: string;
	user: {
		id: string;
		email: string;
		username: string;
		phone: string;
		address: string;
	};
}
