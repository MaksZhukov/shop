import { Box } from '@mui/material';
import { FC } from 'react';
import { BrandLogo } from 'shared/ui';
import { contactGridSx } from '../lib/contactGridSx';
import { FooterAddressBlock } from './footerAddressBlock.component';
import { FooterCallButton } from './footerCallButton.component';
import { FooterEmailBlock } from './footerEmailBlock.component';
import { FooterPhoneBlock } from './footerPhoneBlock.component';

export const FooterContactBar: FC = () => (
	<Box sx={contactGridSx}>
		<BrandLogo sx={{ gridArea: 'logo' }} />
		<FooterAddressBlock sx={{ gridArea: 'address' }} />
		<FooterEmailBlock sx={{ gridArea: 'email', justifySelf: { xs: 'end', md: 'start' } }} />
		<FooterPhoneBlock sx={{ gridArea: 'phone' }} />
		<FooterCallButton sx={{ gridArea: 'button', justifySelf: 'end' }} />
	</Box>
);
