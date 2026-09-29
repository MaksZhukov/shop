import { useDI } from './user.di';

export const useLogin = () => {
	const { userStore, userService } = useDI();

	return async (email: string, password: string, recaptchaToken?: string) => {
		const { data } = await userService.login(email, password, recaptchaToken);
		userStore.setUser({
			id: data.user.id,
			email: data.user.email,
			username: data.user.username,
			phone: data.user.phone,
			address: data.user.address
		});
	};
};
