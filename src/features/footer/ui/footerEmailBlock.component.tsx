import { Box, Link, SxProps, Theme, Typography } from '@mui/material';
import { FC } from 'react';
import { FOOTER_CONTACT } from '../footerConstants';

interface FooterEmailBlockProps {
	sx?: SxProps<Theme>;
}

export const FooterEmailBlock: FC<FooterEmailBlockProps> = ({ sx }) => (
	<Box sx={{ textAlign: { xs: 'right', md: 'left' }, ...sx }}>
		<Typography variant='body2' color='text.primary' sx={{ mb: 0.5 }}>
			Email:
		</Typography>
		<Link
			href={`mailto:${FOOTER_CONTACT.email}`}
			underline='none'
			sx={{ color: 'primary.main', fontWeight: 500, fontSize: '14px' }}
		>
			{FOOTER_CONTACT.email}
		</Link>
	</Box>
);
