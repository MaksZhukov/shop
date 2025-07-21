import { ThemeProvider as MUIThemeProvider } from '@mui/material';
import { FC, ReactNode, useMemo } from 'react';
import { createCustomTheme } from 'services/ThemeService';

export const ThemeProvider: FC<{ children: ReactNode; deviceType: 'desktop' | 'mobile' }> = ({
	children,
	deviceType
}) => {
	const theme = useMemo(() => createCustomTheme(deviceType), [deviceType]);
	return <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>;
};
