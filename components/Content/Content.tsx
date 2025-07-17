import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

const Content = ({ children }: Props) => {
	return (
		<Box pb={4} pt={4} flex='1'>
			{children}
		</Box>
	);
};

export default Content;
