import { ThemeProvider as MUIThemeProvider } from '@mui/material';
import { FC, ReactNode, useMemo } from 'react';
import { createCustomTheme } from 'shared/services/ThemeService';
import { useDeviceType } from 'shared/hooks/useDeviceType';

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const deviceType = useDeviceType();
	const theme = useMemo(() => createCustomTheme(deviceType), [deviceType]);
	return <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>;
};
