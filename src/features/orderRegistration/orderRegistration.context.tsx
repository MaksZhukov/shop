import { createContext, type ReactNode } from 'react';
import type { CartStore } from 'entities/cart';
import type { OrderService } from 'entities/order';
import type { UserStore } from 'entities/user';
import type { OrderRegistrationStore } from './orderRegistration.store';

export type OrderRegistrationContextValue = {
	orderService: OrderService;
	orderRegistrationStore: OrderRegistrationStore;
	userStore: UserStore;
	cartStore: CartStore;
	removeCartMany: (cartItemIds: number[]) => Promise<void> | void;
	renderMobileContacts: (isOpened: boolean, onClose: () => void) => ReactNode;
};

export const OrderRegistrationContext = createContext<OrderRegistrationContextValue | null>(null);

type OrderRegistrationInjectorProps = {
	value: OrderRegistrationContextValue;
	children: ReactNode;
};

export const OrderRegistrationInjector = ({ value, children }: OrderRegistrationInjectorProps) => (
	<OrderRegistrationContext.Provider value={value}>{children}</OrderRegistrationContext.Provider>
);
