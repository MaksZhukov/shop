import { Box, Container, Divider } from '@mui/material';
import { FC, type ReactNode } from 'react';
import { useFooterAuthModal } from '../hooks';
import { footerDividerSx } from '../lib/dividerSx';
import { FooterContactBar } from './footerContactBar.component';
import { FooterLegal } from './footerLegal.component';
import { FooterNavigation } from './footerNavigation.component';
import { PaymentMethods } from './paymentMethods.component';

type FooterProps = {
	loadCart: () => void | Promise<unknown>;
	loadFavorites: () => void | Promise<unknown>;
	renderAuthModal: (props: {
		onChangeModalOpened: (opened: boolean) => void;
		onLoginSuccess: () => void | Promise<void>;
	}) => ReactNode;
};

export const Footer: FC<FooterProps> = ({ loadCart, loadFavorites, renderAuthModal }) => {
	const { isOpenedAuthModal, setIsOpenedAuthModal, handleLoginSuccess, handleSignInClick } = useFooterAuthModal({
		loadCart,
		loadFavorites
	});

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

			{isOpenedAuthModal &&
				renderAuthModal({
					onChangeModalOpened: setIsOpenedAuthModal,
					onLoginSuccess: handleLoginSuccess
				})}
		</Box>
	);
};
