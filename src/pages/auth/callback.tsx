import { authLocalStorage } from 'entities/user/authLocalStorage';
import { useInitialAuthLoad } from 'features/user/useInitialAuthLoad';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Loader } from 'shared/ui';
import { useSnackbar } from 'notistack';

export default function AuthCallbackPage() {
	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();
	const { token } = router.query;
	const effectiveToken = typeof token === 'string' ? token : undefined;

	useInitialAuthLoad(effectiveToken);

	useEffect(() => {
		if (effectiveToken) {
			authLocalStorage.saveJwt(effectiveToken);
			enqueueSnackbar('Вы успешно авторизовались', {
				variant: 'success'
			});
		}
		router.replace('/', undefined, { shallow: true });
	}, [effectiveToken, router, enqueueSnackbar]);

	return <Loader />;
}
