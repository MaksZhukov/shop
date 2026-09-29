import { createContext, type ReactNode } from 'react';
import type { UserService, UserStore } from 'entities/user';
import type { AuthModalStore } from './authModal.store';

export type UserContextValue = {
	userService: UserService;
	userStore: UserStore;
	authModalStore: AuthModalStore;
};

export const UserContext = createContext<UserContextValue | null>(null);

type UserInjectorProps = {
	value: UserContextValue;
	children: ReactNode;
};

export const UserInjector = ({ value, children }: UserInjectorProps) => (
	<UserContext.Provider value={value}>{children}</UserContext.Provider>
);
