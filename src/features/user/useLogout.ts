import { UserService, type UserStore } from 'entities/user';
import { useDI } from './user.di';

export const logout = async (userStore: UserStore, userService: UserService) => {
	userStore.clearUser();
	await userService.logout();
};

export const useLogout = () => {
	const { userStore, userService } = useDI();
	return () => logout(userStore, userService);
};
