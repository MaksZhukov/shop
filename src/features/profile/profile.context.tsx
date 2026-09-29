import { createContext, type ReactNode } from 'react';
import type { UserService, UserStore } from 'entities/user';
import type { ProfileService } from './profile.service';

export type ProfileContextValue = {
	profileService: ProfileService;
	userService: UserService;
	userStore: UserStore;
};

export const ProfileContext = createContext<ProfileContextValue | null>(null);

type ProfileInjectorProps = {
	value: ProfileContextValue;
	children: ReactNode;
};

export const ProfileInjector = ({ value, children }: ProfileInjectorProps) => (
	<ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
);
