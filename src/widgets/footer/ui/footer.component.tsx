import { Box, Container, Divider } from '@mui/material';
import { FC } from 'react';
import { ModalAuth } from 'features/user';
import { useFooterAuthModal } from '../hooks';
import { footerDividerSx } from '../lib/dividerSx';
import { FooterContactBar } from './footerContactBar.component';
import { FooterLegal } from './footerLegal.component';
import { FooterNavigation } from './footerNavigation.component';
import { PaymentMethods } from './paymentMethods.component';

export const Footer: FC = () => {
	const { isOpenedAuthModal, setIsOpenedAuthModal, handleLoginSuccess, handleSignInClick } = useFooterAuthModal();

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
				<FooterNavigation onSignInClick={handleSignInClick} />
				<Divider sx={footerDividerSx} />
				<PaymentMethods />
				<Divider sx={footerDividerSx} />
				<FooterLegal />
			</Container>

			{isOpenedAuthModal && (
				<ModalAuth
					isResetPassword={false}
					onChangeModalOpened={setIsOpenedAuthModal}
					onLoginSuccess={handleLoginSuccess}
				/>
			)}
		</Box>
	);
};
