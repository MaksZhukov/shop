import { createContext, ReactNode, useContext } from 'react';

type OrderRegistrationContextType = {
	renderMobileContacts: (isOpened: boolean, onClose: () => void) => ReactNode;
};

export const OrderRegistrationContext = createContext<OrderRegistrationContextType | null>(null);

export const useOrderRegistrationContext = () => {
	const context = useContext(OrderRegistrationContext);
	if (!context) {
		throw new Error('useOrderRegistrationContext must be used within a OrderRegistrationProvider');
	}
	return context;
};
