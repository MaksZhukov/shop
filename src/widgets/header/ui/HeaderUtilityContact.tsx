import { Box, Typography } from '@mui/material';
import { FC } from 'react';
import { WorkTimetable } from 'features/workTimetable';
import { Link } from 'shared/ui';
import { HEADER_CONTACT } from '../headerConstants';
import { HeaderCallButton } from './HeaderCallButton';

export const HeaderUtilityContact: FC = () => (
	<Box
		sx={{
			display: 'flex',
			alignItems: 'center',
			gap: { md: 2, lg: 3 },
			flexShrink: 0
		}}
	>
		<WorkTimetable />
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
);
