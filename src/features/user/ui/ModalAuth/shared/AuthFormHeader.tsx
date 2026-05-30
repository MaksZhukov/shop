import { Box, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

interface AuthFormHeaderProps {
	title?: ReactNode;
}

const LOGO_SIZE = { width: 170, height: 40 };

export const AuthFormHeader: FC<AuthFormHeaderProps> = ({ title }) => (
	<Box
		sx={{
			mb: 4,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			gap: 1,
			width: '100%'
		}}
	>
		{title != null && (
			<Typography
				variant='body1'
				sx={{
					color: 'text.primary',
					fontWeight: 500,
					textAlign: 'center'
				}}
			>
				{title}
			</Typography>
		)}
	</Box>
);
