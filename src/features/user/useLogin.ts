import { useUserStore, UserService } from 'entities/user';
import { inject } from './user.di';

export const useLogin = () => {
	const userStore = useUserStore();
	const userService = inject(UserService);

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
