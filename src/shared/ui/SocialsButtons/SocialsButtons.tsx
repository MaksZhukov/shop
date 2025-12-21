import { Box, Link, SxProps } from '@mui/material';
import { FC } from 'react';
import { SOCIAL_BUTTONS } from './constants';
import { SocialButton } from './types';

interface SocialButtonsProps {
	data?: SocialButton[];
	sx?: SxProps;
}

export const SocialButtons: FC<SocialButtonsProps> = ({ data = SOCIAL_BUTTONS, sx }) => (
	<Box display='flex' gap={1} sx={sx}>
		{data.map(({ Component: Icon, name, href }) => (
			<Link key={name} href={href} target='_blank' aria-label={`${name}`}>
				<Icon />
			</Link>
		))}
	</Box>
);
