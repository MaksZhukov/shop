import { useLoadCart } from 'features/cart';
import { useLoadFavorites } from 'features/favorites';
import { useState } from 'react';

export const useFooterAuthModal = () => {
	const [isOpenedAuthModal, setIsOpenedAuthModal] = useState(false);
	const loadCart = useLoadCart();
	const loadFavorites = useLoadFavorites();

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
