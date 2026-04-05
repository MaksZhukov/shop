import { MobileContactsModal } from 'features/mobileContacts';
import { OrderRegistrationContext } from 'features/orderRegistration/orderRegistrationContext';
import { ReactNode, useMemo } from 'react';

export const OrderRegistrationProvider = ({ children }: { children: ReactNode }) => {
	const value = useMemo(
		() => ({
			renderMobileContacts: (isOpened: boolean, onClose: () => void) => (
				<MobileContactsModal isOpened={isOpened} onClose={onClose} />
			)
		}),
		[]
	);
	return <OrderRegistrationContext.Provider value={value}>{children}</OrderRegistrationContext.Provider>;
};
