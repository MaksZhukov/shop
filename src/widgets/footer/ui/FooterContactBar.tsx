import { Box } from '@mui/material';
import { FC } from 'react';
import { BrandLogo } from 'shared/ui';
import { contactGridSx } from '../lib/contactGridSx';
import { FooterAddressBlock } from './FooterAddressBlock';
import { FooterCallButton } from './FooterCallButton';
import { FooterEmailBlock } from './FooterEmailBlock';
import { FooterPhoneBlock } from './FooterPhoneBlock';

export const FooterContactBar: FC = () => (
	<Box sx={contactGridSx}>
		<BrandLogo sx={{ gridArea: 'logo' }} />
		<FooterAddressBlock sx={{ gridArea: 'address' }} />
		<FooterEmailBlock sx={{ gridArea: 'email', justifySelf: { xs: 'end', md: 'start' } }} />
		<FooterPhoneBlock sx={{ gridArea: 'phone' }} />
		<FooterCallButton sx={{ gridArea: 'button', justifySelf: 'end' }} />
	</Box>
);
