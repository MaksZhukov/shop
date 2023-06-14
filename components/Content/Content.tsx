import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

const Content = ({ children }: Props) => {
	return (
		<Box flex='1' paddingTop={{ xs: '3.5em', md: '4em' }} paddingBottom='2em'>
			{children}
		</Box>
	);
};

export default Content;
