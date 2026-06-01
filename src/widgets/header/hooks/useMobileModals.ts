import { useState } from 'react';

export const useMobileModals = () => {
	const [isOpenedMobileMenu, setIsOpenedMobileMenu] = useState(false);

	const handleOpenMobileMenu = () => {
		setIsOpenedMobileMenu(true);
	};

	const handleCloseMobileMenu = () => {
		setIsOpenedMobileMenu(false);
	};

	return {
		isOpenedMobileMenu,
		handleOpenMobileMenu,
		handleCloseMobileMenu
	};
};
