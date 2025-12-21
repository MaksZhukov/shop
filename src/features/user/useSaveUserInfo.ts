import { useUserStore } from 'entities/user';
import { userApi } from 'entities/user';

export const useSaveUserInfo = () => {
	const userStore = useUserStore();

	return async () => {
		await userApi.updateUserInfo({
			phone: userStore.phone,
			address: userStore.address,
			username: userStore.username
		});
	};
};
