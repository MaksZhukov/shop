import { SnackbarProvider as NotistackSnackbarProvider } from 'notistack';
import { FC, ReactNode } from 'react';
import NotistackService from 'services/NotistackService';

export const SnackbarProvider: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<NotistackSnackbarProvider
			autoHideDuration={3000}
			ref={(ref) => {
				if (ref) {
					NotistackService.setRef(ref);
				}
			}}
			maxSnack={3}
		>
			{children}
		</NotistackSnackbarProvider>
	);
};
