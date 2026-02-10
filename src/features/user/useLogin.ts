import { useUserStore } from 'entities/user';
import { userApi } from 'entities/user';
import { authLocalStorage } from 'entities/user/authLocalStorage';

export const useLogin = () => {
	const userStore = useUserStore();

	return async (email: string, password: string, recaptchaToken?: string) => {
		const { data } = await userApi.login(email, password, recaptchaToken);
		userStore.setUser({
			jwt: data.jwt,
			id: data.user.id,
			email: data.user.email,
			username: data.user.username,
			phone: data.user.phone,
			address: data.user.address
		});
		authLocalStorage.saveJwt(data.jwt);
	};
};
