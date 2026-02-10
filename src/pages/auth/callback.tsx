import { authLocalStorage } from 'entities/user/authLocalStorage';
import { useInitialAuthLoad } from 'features/user/useInitialAuthLoad';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Loader } from 'shared/ui';

export default function AuthCallbackPage() {
	const router = useRouter();
	const { token } = router.query;
	const effectiveToken = typeof token === 'string' ? token : undefined;

	useInitialAuthLoad(effectiveToken);

	useEffect(() => {
		if (effectiveToken) {
			authLocalStorage.saveJwt(effectiveToken);
		}
		router.replace('/', undefined, { shallow: true });
	}, [effectiveToken, router]);

	return <Loader />;
}
