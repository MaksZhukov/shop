import { useUserStore, UserService } from 'entities/user';
import { useCallback } from 'react';
import { inject } from './user.di';

export const useLoadUserInfo = () => {
	const userStore = useUserStore();
	const userService = inject(UserService);

	return useCallback(async () => {
		const { data } = await userService.getUserInfo();
		userStore.setId(data.id);
		userStore.setEmail(data.email);
		userStore.setUsername(data.username);
		userStore.setPhone(data.phone || '');
		userStore.setAddress(data.address || '');
	}, [userStore, userService]);
};
