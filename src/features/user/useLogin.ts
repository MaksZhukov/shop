import { useUserStore } from 'entities/user';
import { userApi } from 'entities/user';

export const useLogin = () => {
	const userStore = useUserStore();

	return async (email: string, password: string, recaptchaToken?: string) => {
		const { data } = await userApi.login(email, password, recaptchaToken);
		userStore.setUser({
			id: data.user.id,
			email: data.user.email,
			username: data.user.username,
			phone: data.user.phone,
			address: data.user.address
		});
	};
};
