import { useUserStore } from 'entities/user';
import { userApi } from 'entities/user';

export const useLoadUserInfo = () => {
	const userStore = useUserStore();

	return async () => {
		const { data } = await userApi.getUserInfo();
		userStore.setId(data.id);
		userStore.setEmail(data.email);
		userStore.setUsername(data.username);
		userStore.setPhone(data.phone || '');
		userStore.setAddress(data.address || '');
	};
};
