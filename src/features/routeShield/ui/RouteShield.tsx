import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import { FC, ReactNode, useEffect, useContext } from 'react';
import { MobXProviderContext } from 'mobx-react';
import { PRIVATE_PATHS } from 'shared/constants';
import { useUserStore } from 'entities/user';
import { Loader } from 'shared/ui';

interface RouteShieldProps {
	children: ReactNode;
}

export const RouteShield: FC<RouteShieldProps> = observer(({ children }) => {
	const userStore = useUserStore();
	const { store } = useContext(MobXProviderContext) as { store: { isInitialRequestDone: boolean } };
	const router = useRouter();

	useEffect(() => {
		if (!userStore.id && store.isInitialRequestDone && PRIVATE_PATHS.includes(router.pathname)) {
			router.push('/', undefined, { shallow: true });
		}
	}, [userStore.id, store.isInitialRequestDone, router]);

	if (PRIVATE_PATHS.includes(router.pathname)) {
		if (!store.isInitialRequestDone) {
			return <Loader />;
		}
		if (userStore.id && store.isInitialRequestDone) {
			return <>{children}</>;
		}
	} else {
		return <>{children}</>;
	}
	return <></>;
});
