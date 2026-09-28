import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
type AuthModalActions = {
	logout: () => void;
	clearFavorites: () => void;
	loadFavorites: () => void | Promise<unknown>;
};

export const useAuthModal = (isResetPassword: boolean, actions: AuthModalActions) => {
	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();
	const { logout, clearFavorites, loadFavorites } = actions;
	const [isOpenedAuthModal, setIsOpenedAuthModal] = useState<boolean>(false);

	useEffect(() => {
		if (isResetPassword) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setIsOpenedAuthModal(true);
		}
	}, [isResetPassword]);

	const handleClickLogout = async () => {
		try {
			logout();
			clearFavorites();
			await loadFavorites();

			enqueueSnackbar('Вы успешно вышли из аккаунта', {
				variant: 'success'
			});
		} catch (err) {
			enqueueSnackbar('Произошла какая-то ошибка с выходом из аккаунта, обратитесь в поддержку', {
				variant: 'error'
			});
		}
		router.push('/', undefined, { shallow: true });
	};

	const handleClickSignIn = () => {
		setIsOpenedAuthModal(true);
	};

	return {
		isOpenedAuthModal,
		setIsOpenedAuthModal,
		handleClickSignIn,
		handleClickLogout
	};
};
