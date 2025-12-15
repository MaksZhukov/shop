import { FC, ReactNode, useEffect } from 'react';
import { setupApiInterceptors } from 'shared/api';
import { useStore } from './StoreProvider';
import { logout } from 'features/user';
import { useSnackbar } from 'notistack';

interface ApiProviderProps {
	children: ReactNode;
}

export const ApiProvider: FC<ApiProviderProps> = ({ children }) => {
	const store = useStore();
	const { enqueueSnackbar } = useSnackbar();
	useEffect(() => {
		const getUserJwt = () => {
			return store.user.jwt;
		};
		const errorResponseUnauthorizedCallback = () => {
			if (store.user.id) {
				logout(store.user);
			}
		};
		const errorResponseTooManyRequestsCallback = () => {
			enqueueSnackbar('Слишком много запросов, попробуйте позже', {
				variant: 'warning'
			});
		};
		setupApiInterceptors(getUserJwt, errorResponseUnauthorizedCallback, errorResponseTooManyRequestsCallback);
	}, [store]);

	return <>{children}</>;
};
