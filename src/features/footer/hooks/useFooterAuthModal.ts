import { useState } from 'react';

type FooterAuthActions = {
	loadCart: () => void | Promise<unknown>;
	loadFavorites: () => void | Promise<unknown>;
};

export const useFooterAuthModal = ({ loadCart, loadFavorites }: FooterAuthActions) => {
	const [isOpenedAuthModal, setIsOpenedAuthModal] = useState(false);

	const handleLoginSuccess = async () => {
		await Promise.all([loadCart(), loadFavorites()]);
	};

	const handleSignInClick = () => {
		setIsOpenedAuthModal(true);
	};

	return {
		isOpenedAuthModal,
		setIsOpenedAuthModal,
		handleLoginSuccess,
		handleSignInClick
	};
};
