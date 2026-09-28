import { useUserStore, UserService } from 'entities/user';
import { inject } from './user.di';

export const logout = async (userStore: ReturnType<typeof useUserStore>, userService: UserService) => {
	userStore.clearUser();
	await userService.logout();
};

export const useLogout = () => {
	const userStore = useUserStore();
	const userService = inject(UserService);
	return () => logout(userStore, userService);
};
