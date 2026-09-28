import { useUserStore, UserService } from 'entities/user';
import { inject } from './user.di';

export const useSaveUserInfo = () => {
	const userStore = useUserStore();
	const userService = inject(UserService);

	return async () => {
		await userService.updateUserInfo({
			phone: userStore.phone,
			address: userStore.address,
			username: userStore.username
		});
	};
};
