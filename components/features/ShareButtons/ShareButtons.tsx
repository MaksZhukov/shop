import { Box } from '@mui/material';
import { FC } from 'react';
import { SkypeIcon, InstagramIcon } from 'components/Icons';
import { SHARE_BUTTONS } from './constants';

interface ShareButtonsProps {
	origin: string;
	title: string;
}

export const ShareButtons: FC<ShareButtonsProps> = ({ origin, title }) => (
	<Box textAlign={{ xs: 'center', md: 'left' }} display='flex' gap={1}>
		{SHARE_BUTTONS.map(({ Component, Icon, name }) => (
			<Component key={name} url={origin} title={title} aria-label={`Поделиться в ${name}`}>
				<Icon />
			</Component>
		))}
		<Box
			component='a'
			href={`https://web.skype.com/share?url=${encodeURIComponent(origin)}&text=${encodeURIComponent(title)}`}
			target='_blank'
			rel='noopener noreferrer'
			sx={{ cursor: 'pointer' }}
			aria-label='Поделиться в Skype'
		>
			<SkypeIcon />
		</Box>
		<Box
			component='a'
			href={`https://www.instagram.com/?url=${encodeURIComponent(origin)}&title=${encodeURIComponent(title)}`}
			target='_blank'
			rel='noopener noreferrer'
			sx={{ cursor: 'pointer' }}
			aria-label='Поделиться в Instagram'
		>
			<InstagramIcon />
		</Box>
	</Box>
);
