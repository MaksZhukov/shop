import { useUserStore } from './useUserStore';
import { userApi } from './userApi';

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




