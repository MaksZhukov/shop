import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import { FC, ReactNode, useEffect } from 'react';
import { PRIVATE_PATHS } from 'shared/constants';
import { useUserStore } from 'entities/user';
import { Loader } from 'shared/ui';

interface RouteShieldProps {
	children: ReactNode;
}

export const RouteShield: FC<RouteShieldProps> = observer(({ children }) => {
	const userStore = useUserStore();
	const router = useRouter();

	useEffect(() => {
		if (!userStore.id && userStore.isInitialRequestDone && PRIVATE_PATHS.includes(router.pathname)) {
			router.push('/', undefined, { shallow: true });
		}
	}, [userStore.id, userStore.isInitialRequestDone, router]);

	if (PRIVATE_PATHS.includes(router.pathname)) {
		if (!userStore.isInitialRequestDone) {
			return <Loader />;
		}
		if (userStore.id && userStore.isInitialRequestDone) {
			return <>{children}</>;
		}
	} else {
		return <>{children}</>;
	}
	return <></>;
});
