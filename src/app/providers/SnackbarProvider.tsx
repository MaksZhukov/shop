import { SnackbarProvider as NotistackSnackbarProvider } from 'notistack';
import { FC, ReactNode } from 'react';

export const SnackbarProvider: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<NotistackSnackbarProvider autoHideDuration={3000} maxSnack={3}>
			{children}
		</NotistackSnackbarProvider>
	);
};
