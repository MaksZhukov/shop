import { createContext, type ReactNode } from 'react';
import type { UserStore } from 'entities/user';

export type FooterContextValue = {
	userStore: UserStore;
	openAuth: () => void;
};

export const FooterContext = createContext<FooterContextValue | null>(null);

type FooterInjectorProps = {
	value: FooterContextValue;
	children: ReactNode;
};

export const FooterInjector = ({ value, children }: FooterInjectorProps) => (
	<FooterContext.Provider value={value}>{children}</FooterContext.Provider>
);
