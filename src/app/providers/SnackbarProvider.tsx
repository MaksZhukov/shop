import { SnackbarProvider as NotistackSnackbarProvider, useSnackbar } from 'notistack';
import { FC, ReactNode, useLayoutEffect } from 'react';
import { useInjection } from 'shared/di/di.hook';
import { SnackbarService } from 'shared/services';

const SnackbarBinder: FC<{ children: ReactNode }> = ({ children }) => {
	const snackbarService = useInjection(SnackbarService);
	const { enqueueSnackbar } = useSnackbar();

	useLayoutEffect(() => {
		snackbarService.bind(enqueueSnackbar);
	}, [enqueueSnackbar, snackbarService]);

	return <>{children}</>;
};

export const SnackbarProvider: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<NotistackSnackbarProvider autoHideDuration={3000} maxSnack={3}>
			<SnackbarBinder>{children}</SnackbarBinder>
		</NotistackSnackbarProvider>
	);
};
