import { Box, Link, SxProps, Theme, Typography } from '@mui/material';
import { FC } from 'react';
import { FOOTER_CONTACT } from '../footerConstants';

interface FooterPhoneBlockProps {
	sx?: SxProps<Theme>;
}

export const FooterPhoneBlock: FC<FooterPhoneBlockProps> = ({ sx }) => (
	<Box sx={sx}>
		<Link
			href={`tel:${FOOTER_CONTACT.phone}`}
			underline='none'
			sx={{ color: 'text.primary', fontWeight: 600, fontSize: '16px', display: 'block', whiteSpace: 'nowrap' }}
		>
			{FOOTER_CONTACT.phoneLabel}
		</Link>
		<Typography variant='body2' color='text.secondary' sx={{ mt: 0.5, whiteSpace: 'nowrap' }}>
			{FOOTER_CONTACT.workingHours}
		</Typography>
	</Box>
);
