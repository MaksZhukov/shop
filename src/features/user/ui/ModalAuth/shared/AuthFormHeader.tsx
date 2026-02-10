import { Box, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

interface AuthFormHeaderProps {
	title?: ReactNode;
}

const LOGO_SIZE = { width: 170, height: 40 };

export const AuthFormHeader: FC<AuthFormHeaderProps> = ({ title }) => (
	<Box mb={4} display="flex" flexDirection="column" alignItems="center" gap={1} width="100%">
		<Box
			width={LOGO_SIZE.width}
			height={LOGO_SIZE.height}
			bgcolor="gray"
			display="flex"
			alignItems="center"
			justifyContent="center"
		>
			Logo
		</Box>
		{title != null && (
			<Typography variant="body1" color="text.primary" fontWeight={500} textAlign="center">
				{title}
			</Typography>
		)}
	</Box>
);
