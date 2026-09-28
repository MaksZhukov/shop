import { Box, Button, IconButton, Typography } from '@mui/material';
import { FC, type ReactNode } from 'react';
import { MenuIcon } from 'shared/icons';
import { Link } from 'shared/ui';
import { HEADER_CONTACT } from '../headerConstants';
import { HeaderCallButton } from './headerCallButton.component';

interface HeaderMobileUtilityBarProps {
	onOpenMenu: () => void;
	workTimetable: ReactNode;
}

export const HeaderMobileUtilityBar: FC<HeaderMobileUtilityBarProps> = ({ onOpenMenu, workTimetable }) => (
	<>
		<Box
			sx={{
				display: { xs: 'grid', sm: 'none', lg: 'none' },
				gridTemplateColumns: 'auto 1fr auto',
				alignItems: 'center',
				gap: 1,
				pb: 1.5
			}}
		>
			<IconButton onClick={onOpenMenu} aria-label='Меню' sx={{ p: 0, justifySelf: 'start', flexShrink: 0 }}>
				<MenuIcon />
			</IconButton>

			<Typography
				component={Link}
				href={`tel:${HEADER_CONTACT.phone}`}
				variant='body2'
				color='text.secondary'
				sx={{
					justifySelf: 'center',
					fontWeight: 700,
					textDecoration: 'none',
					whiteSpace: 'nowrap',
					typography: { sm: 'body1' }
				}}
			>
				{HEADER_CONTACT.phoneLabel}
			</Typography>

			<Box sx={{ justifySelf: 'end' }}>
				<HeaderCallButton />
			</Box>
		</Box>

		<Box
			sx={{
				display: { xs: 'none', sm: 'grid', lg: 'none' },
				gridTemplateColumns: 'auto 1fr auto',
				alignItems: 'center',
				gap: 2,
				pb: 1.5
			}}
		>
			<Button
				onClick={onOpenMenu}
				startIcon={<MenuIcon />}
				size='small'
				sx={{
					minWidth: 'auto',
					px: 0,
					color: 'text.primary',
					justifySelf: 'start'
				}}
			>
				Меню
			</Button>

			<Box sx={{ justifySelf: 'end', minWidth: 0 }}>
				{workTimetable}
			</Box>

			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifySelf: 'end' }}>
				<Typography
					component={Link}
					href={`tel:${HEADER_CONTACT.phone}`}
					variant='body1'
					color='text.secondary'
					sx={{
						fontWeight: 700,
						textDecoration: 'none',
						whiteSpace: 'nowrap'
					}}
				>
					{HEADER_CONTACT.phoneLabel}
				</Typography>
				<HeaderCallButton />
			</Box>
		</Box>
	</>
);
