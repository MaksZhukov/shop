import { Button, SxProps, Theme } from '@mui/material';
import NextLink from 'next/link';
import { FC } from 'react';

interface FooterCallButtonProps {
	sx?: SxProps<Theme>;
}

export const FooterCallButton: FC<FooterCallButtonProps> = ({ sx }) => (
	<Button
		variant='outlined'
		color='primary'
		LinkComponent={NextLink}
		href='/contacts'
		sx={{
			fontWeight: 600,
			fontSize: '12px',
			letterSpacing: '0.04em',
			whiteSpace: 'nowrap',
			px: 2.5,
			py: 1.25,
			...sx
		}}
	>
		ЗАКАЗАТЬ ЗВОНОК
	</Button>
);
