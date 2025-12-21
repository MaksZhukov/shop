import { useUserStore } from 'entities/user';
import { useCallback } from 'react';

export const setJWT = (userStore: ReturnType<typeof useUserStore>, jwt: string) => {
	userStore.setJWT(jwt);
};

export const useSetJWT = () => {
	const userStore = useUserStore();
	return useCallback((jwt: string) => setJWT(userStore, jwt), [userStore]);
};
