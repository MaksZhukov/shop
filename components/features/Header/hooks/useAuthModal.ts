import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useStore } from 'store';

export const useAuthModal = () => {
	const router = useRouter();
	const store = useStore();
	const { enqueueSnackbar } = useSnackbar();
	const [isOpenedAuthModal, setIsOpenedAuthModal] = useState<boolean>(false);

	const handleClickLogout = async () => {
		try {
			await store.user.logout();

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
