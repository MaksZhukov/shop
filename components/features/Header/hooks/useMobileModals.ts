import { useState } from 'react';

export const useMobileModals = () => {
	const [isOpenedMobileContacts, setIsOpenedMobileContacts] = useState<boolean>(false);
	const [isOpenedMobileSearch, setIsOpenedMobileSearch] = useState(false);

	const handleCloseMobileSearch = () => {
		setIsOpenedMobileSearch(false);
	};

	return {
		isOpenedMobileContacts,
		setIsOpenedMobileContacts,
		isOpenedMobileSearch,
		setIsOpenedMobileSearch,
		handleCloseMobileSearch
	};
};
