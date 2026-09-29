import { Typography } from '@mui/material';
import { PRIVACY_TITLE } from '../privacy.constants';

export const PrivacyHeader = () => (
	<Typography component='h1' variant='h4' sx={{ mb: '1em', textAlign: 'center' }}>
		{PRIVACY_TITLE}
	</Typography>
);
