import { createContext, type ReactNode } from 'react';
import type { CartStore } from 'entities/cart';
import type { OrderService } from 'entities/order';
import type { UserStore } from 'entities/user';

export type OrderRegistrationContextValue = {
	orderService: OrderService;
	userStore: UserStore;
	cartStore: CartStore;
};

export const OrderRegistrationContext = createContext<OrderRegistrationContextValue | null>(null);

type OrderRegistrationInjectorProps = {
	value: OrderRegistrationContextValue;
	children: ReactNode;
};

export const OrderRegistrationInjector = ({ value, children }: OrderRegistrationInjectorProps) => (
	<OrderRegistrationContext.Provider value={value}>{children}</OrderRegistrationContext.Provider>
);
