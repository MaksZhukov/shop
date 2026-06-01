import { Box } from '@mui/material';
import { FC } from 'react';
import { HeaderUtilityContact } from './HeaderUtilityContact';
import { HeaderUtilityLinks } from './HeaderUtilityLinks';

export const HeaderUtilityBar: FC = () => (
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
		<HeaderUtilityContact />
	</Box>
);
