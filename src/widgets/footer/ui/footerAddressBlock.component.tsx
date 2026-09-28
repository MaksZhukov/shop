import { SxProps, Theme, Typography } from '@mui/material';
import { FC } from 'react';
import { FOOTER_ADDRESS } from '../footerConstants';

interface FooterAddressBlockProps {
	sx?: SxProps<Theme>;
}

export const FooterAddressBlock: FC<FooterAddressBlockProps> = ({ sx }) => (
	<Typography
		variant='body2'
		color='text.primary'
		sx={{ lineHeight: 1.5, minWidth: 0, display: { xs: 'none', md: 'block' }, ...sx }}
	>
		{FOOTER_ADDRESS}
	</Typography>
);
