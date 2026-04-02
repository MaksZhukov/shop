import { FC, ReactNode, useEffect } from 'react';
import { setupApiInterceptors } from 'shared/api';
import { logout } from 'features/user';
import { useSnackbar } from 'notistack';
import { useUserStore } from 'entities/user';

interface ApiProviderProps {
	children: ReactNode;
}

export const ApiProvider: FC<ApiProviderProps> = ({ children }) => {
	const userStore = useUserStore();
	const { enqueueSnackbar } = useSnackbar();
	useEffect(() => {
		const errorResponseUnauthorizedCallback = () => {
			if (userStore.id) {
				logout(userStore);
			}
		};
		const errorResponseTooManyRequestsCallback = () => {
			enqueueSnackbar('Слишком много запросов, попробуйте позже', {
				variant: 'warning'
			});
		};
		setupApiInterceptors(errorResponseUnauthorizedCallback, errorResponseTooManyRequestsCallback);
	}, [userStore, enqueueSnackbar]);

	return <>{children}</>;
};
