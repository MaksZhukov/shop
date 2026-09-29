import { Box, Container, Divider } from '@mui/material';
import { FC } from 'react';
import { footerDividerSx } from '../lib/dividerSx';
import { FooterContactBar } from './footerContactBar.component';
import { FooterLegal } from './footerLegal.component';
import { FooterNavigation } from './footerNavigation.component';
import { PaymentMethods } from './paymentMethods.component';

export const Footer: FC = () => {
	return (
		<Box
			component='footer'
			role='contentinfo'
			sx={{
				bgcolor: 'background.paper',
				borderTop: '1px solid',
				borderColor: 'custom.divider'
			}}
		>
			<Container>
				<FooterContactBar />
				<Divider sx={footerDividerSx} />
				<FooterNavigation />
				<Divider sx={footerDividerSx} />
				<PaymentMethods />
				<Divider sx={footerDividerSx} />
				<FooterLegal />
			</Container>
		</Box>
	);
};
