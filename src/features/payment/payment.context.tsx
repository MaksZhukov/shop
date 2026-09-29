import { createContext, type ReactNode } from 'react';
import type { DefaultPage } from 'entities/page';

export type PaymentPage = DefaultPage & { content: string };

export type PaymentContextValue = {
	page: PaymentPage;
};

export const PaymentContext = createContext<PaymentContextValue | null>(null);

type PaymentInjectorProps = {
	value: PaymentContextValue;
	children: ReactNode;
};

export const PaymentInjector = ({ value, children }: PaymentInjectorProps) => (
	<PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
);
