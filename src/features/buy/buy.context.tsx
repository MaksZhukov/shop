import { createContext, type ReactNode } from 'react';
import type { OrderService } from 'entities/order';

export type BuyContextValue = {
	orderService: OrderService;
};

export const BuyContext = createContext<BuyContextValue | null>(null);

type BuyInjectorProps = {
	value: BuyContextValue;
	children: ReactNode;
};

export const BuyInjector = ({ value, children }: BuyInjectorProps) => (
	<BuyContext.Provider value={value}>{children}</BuyContext.Provider>
);
