import { useUserStore } from 'entities/user';
import { authLocalStorage } from 'entities/user/authLocalStorage';

export const logout = (userStore: ReturnType<typeof useUserStore>) => {
	userStore.clearUser();
	authLocalStorage.removeJwt();
};

export const useLogout = () => {
	const userStore = useUserStore();
	return () => logout(userStore);
};
