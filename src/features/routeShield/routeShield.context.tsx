import { createContext, type ReactNode } from 'react';
import type { UserStore } from 'entities/user';

export type RouteShieldContextValue = {
	userStore: UserStore;
};

export const RouteShieldContext = createContext<RouteShieldContextValue | null>(null);

type RouteShieldInjectorProps = {
	value: RouteShieldContextValue;
	children: ReactNode;
};

export const RouteShieldInjector = ({ value, children }: RouteShieldInjectorProps) => (
	<RouteShieldContext.Provider value={value}>{children}</RouteShieldContext.Provider>
);
