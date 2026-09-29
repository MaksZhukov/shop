import { FC, ReactNode, useLayoutEffect } from 'react';
import { setupApiInterceptors } from 'shared/api';
import { logout } from 'features/user';
import { useSnackbar } from 'notistack';
import { UserService, UserStore } from 'entities/user';
import { useInjection } from 'shared/di/di.hook';

interface ApiProviderProps {
	children: ReactNode;
}

export const ApiProvider: FC<ApiProviderProps> = ({ children }) => {
	const userStore = useInjection(UserStore);
	const userService = useInjection(UserService);
	const { enqueueSnackbar } = useSnackbar();
	useLayoutEffect(() => {
		const errorResponseUnauthorizedCallback = () => {
			if (userStore.id) {
				logout(userStore, userService);
			}
		};
		const errorResponseTooManyRequestsCallback = () => {
			enqueueSnackbar('Слишком много запросов, попробуйте позже', {
				variant: 'warning'
			});
		};
		setupApiInterceptors(errorResponseUnauthorizedCallback, errorResponseTooManyRequestsCallback);
	}, [userStore, userService, enqueueSnackbar]);

	return <>{children}</>;
};
