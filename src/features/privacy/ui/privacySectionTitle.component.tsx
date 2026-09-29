import { Typography } from '@mui/material';
import type { ReactNode } from 'react';

type PrivacySectionTitleProps = {
	children: ReactNode;
};

export const PrivacySectionTitle = ({ children }: PrivacySectionTitleProps) => (
	<Typography gutterBottom sx={{ mt: '1em', fontWeight: 'bold', '&:first-of-type': { mt: 0 } }}>
		{children}
	</Typography>
);
