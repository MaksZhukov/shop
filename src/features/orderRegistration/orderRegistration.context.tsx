import { createContext, type ReactNode } from 'react';
import type { OrderRegistrationService, OrderRegistrationStartOptions } from './orderRegistration.service';
import type { OrderRegistrationStore } from './orderRegistration.store';

export type OrderRegistrationContextValue = {
	orderRegistrationStore: OrderRegistrationStore;
	orderRegistrationService: OrderRegistrationService;
	onOrderPlaced: OrderRegistrationStartOptions['onOrderPlaced'];
	/** Status of the cart load (the cart feature's `load` action). */
	cartLoad: { ready: () => boolean };
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
