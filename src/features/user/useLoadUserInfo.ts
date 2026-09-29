import { useCallback } from 'react';
import { useDI } from './user.di';

export const useLoadUserInfo = () => {
	const { userStore, userService } = useDI();

	return useCallback(async () => {
		const { data } = await userService.getUserInfo();
		userStore.setId(data.id);
		userStore.setEmail(data.email);
		userStore.setUsername(data.username);
		userStore.setPhone(data.phone || '');
		userStore.setAddress(data.address || '');
	}, [userStore, userService]);
};
