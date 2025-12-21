import { useUserStore } from './useUserStore';

export const useSetJWT = () => {
	const userStore = useUserStore();
	return (jwt: string) => userStore.setJWT(jwt);
};



