import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useLogout } from 'features/user';
import { useClearFavorites } from 'features/favorites';
import { useLoadFavorites } from 'features/favorites';

export const useAuthModal = () => {
	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();
	const logout = useLogout();
	const clearFavorites = useClearFavorites();
	const loadFavorites = useLoadFavorites();
	const [isOpenedAuthModal, setIsOpenedAuthModal] = useState<boolean>(false);

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
