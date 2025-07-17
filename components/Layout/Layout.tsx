import { ReactNode } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';

interface Props {
	children: ReactNode;
}

const Layout = ({ children }: Props) => {
	const theme = useTheme();
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	const headerHeight = isMobile ? 72 : 112;
	return (
		<Box bgcolor={'background.default'} pt={`${headerHeight}px`} minHeight={'100vh'}>
			{children}
		</Box>
	);
};

export default Layout;
