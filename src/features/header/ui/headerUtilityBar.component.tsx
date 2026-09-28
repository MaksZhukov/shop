import { Box } from '@mui/material';
import { FC, type ReactNode } from 'react';
import { HeaderUtilityContact } from './headerUtilityContact.component';
import { HeaderUtilityLinks } from './headerUtilityLinks.component';

export const HeaderUtilityBar: FC<{ workTimetable: ReactNode }> = ({ workTimetable }) => (
	<Box
		sx={{
			display: { xs: 'none', lg: 'flex' },
			alignItems: 'center',
			justifyContent: 'space-between',
			gap: 2,
			pb: 1.5
		}}
	>
		<HeaderUtilityLinks />
		<HeaderUtilityContact workTimetable={workTimetable} />
	</Box>
);
