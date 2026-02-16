import { userApi, useUserStore } from 'entities/user';

export const logout = async (userStore: ReturnType<typeof useUserStore>) => {
	userStore.clearUser();
	await userApi.logout();
};

export const useLogout = () => {
	const userStore = useUserStore();
	return () => logout(userStore);
};
