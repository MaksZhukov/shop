import { Box, Typography } from '@mui/material';
import { FC } from 'react';
import { Link } from 'shared/ui';
import { HEADER_UTILITY_LINKS } from '../headerConstants';

export const HeaderUtilityLinks: FC = () => (
	<Box
		component='nav'
		sx={{
			display: 'flex',
			flexWrap: 'wrap',
			alignItems: 'center',
			gap: { md: 2, lg: 3 }
		}}
	>
		{HEADER_UTILITY_LINKS.map((link) => (
			<Typography
				key={link.label}
				component={Link}
				href={link.href}
				variant='body2'
				color='custom.text-muted'
				sx={{
					textDecoration: 'none',
					whiteSpace: 'nowrap',
					'&:hover': {
						color: 'text.primary'
					}
				}}
			>
				{link.label}
			</Typography>
		))}
	</Box>
);
