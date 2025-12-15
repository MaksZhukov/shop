import { useUserStore } from 'entities/user';

export const setJWT = (userStore: ReturnType<typeof useUserStore>, jwt: string) => {
	userStore.setJWT(jwt);
};

export const useSetJWT = () => {
	const userStore = useUserStore();
	return (jwt: string) => setJWT(userStore, jwt);
};
