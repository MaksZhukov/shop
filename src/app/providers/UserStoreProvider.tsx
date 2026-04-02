import { UserStore } from 'entities/user';
import { UserStoreContext } from 'entities/user/userContext';

const userStore = new UserStore();

export const UserStoreProvider = ({ children }: { children: React.ReactNode }) => {
	return <UserStoreContext.Provider value={userStore}>{children}</UserStoreContext.Provider>;
};
