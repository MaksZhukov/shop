import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import { PRIVATE_PATHS } from '../../constants';
import { useStore } from '../../store';
import Loader from '../Loader/Loader';
interface Props {
	children: ReactNode;
}

const RouteShield = ({ children }: Props) => {
	let store = useStore();
	let router = useRouter();
	useEffect(() => {
		if (
			!store.user.id &&
			store.isInitialRequestDone &&
			PRIVATE_PATHS.includes(router.pathname)
		) {
			router.push('/');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [store.user.id, store.isInitialRequestDone]);

	if (PRIVATE_PATHS.includes(router.pathname)) {
		if (!store.isInitialRequestDone) {
			return <Loader />;
		}
		if (store.user.id && store.isInitialRequestDone) {
			return <>{children}</>;
		}
	} else {
		return <>{children}</>;
	}
	return <></>;
};

export default observer(RouteShield);
