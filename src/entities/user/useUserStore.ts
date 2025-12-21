import { useContext } from 'react';
import { MobXProviderContext } from 'mobx-react';
import { UserStore } from './userStore';

export const useUserStore = (): UserStore => {
	const { store } = useContext(MobXProviderContext) as { store: { user: UserStore } };
	return store.user;
};
