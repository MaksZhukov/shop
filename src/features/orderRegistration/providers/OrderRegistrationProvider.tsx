import { OrderRegistrationContext } from '../orderRegistrationContext';
import { ReactNode, useMemo } from 'react';

export const OrderRegistrationProvider = ({
	children,
	renderMobileContacts
}: {
	children: ReactNode;
	renderMobileContacts: (isOpened: boolean, onClose: () => void) => ReactNode;
}) => {
	const value = useMemo(() => ({ renderMobileContacts }), [renderMobileContacts]);
	return <OrderRegistrationContext.Provider value={value}>{children}</OrderRegistrationContext.Provider>;
};
