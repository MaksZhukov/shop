import { FC, ReactNode, useLayoutEffect } from 'react';
import { setupApiInterceptors } from 'shared/api';
import { inject, logout } from 'features/user';
import { useSnackbar } from 'notistack';
import { useUserStore, UserService } from 'entities/user';

interface ApiProviderProps {
	children: ReactNode;
}

export const ApiProvider: FC<ApiProviderProps> = ({ children }) => {
	const userStore = useUserStore();
	const userService = inject(UserService);
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
