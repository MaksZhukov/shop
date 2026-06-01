import { ReactNode } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { HEADER_HEIGHT } from 'shared/constants/headerLayout';

interface Props {
	children: ReactNode;
}

export const Layout = ({ children }: Props) => {
	const theme = useTheme();
	const isCompactHeader = useMediaQuery(theme.breakpoints.down('lg'));
	const headerHeight = isCompactHeader ? HEADER_HEIGHT.tablet : HEADER_HEIGHT.desktop;

	return (
		<Box
			sx={{
				bgcolor: 'background.default',
				pt: `${headerHeight}px`,
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column'
			}}
		>
			{children}
		</Box>
	);
};
