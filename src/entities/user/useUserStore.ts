import { useContext } from 'react';
import { UserStore } from './userStore';
import { UserStoreContext } from './userContext';

export const useUserStore = (): UserStore => {
	const userStore = useContext(UserStoreContext);
	if (!userStore) {
		throw new Error('UserStore not found');
	}
	return userStore;
};
