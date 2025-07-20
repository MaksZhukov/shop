import { Box, Typography, Container, useTheme } from '@mui/material';
import { Footer as IFooter } from 'api/layout/types';
import ReactMarkdown from 'components/ReactMarkdown';
import NextLink from 'next/link';
import { FC } from 'react';
import ContactInfo from './ContactInfo';
import { SocialButtons } from '../features/SocialsButtons';
import NavigationLinks from './NavigationLinks';
import CompanyInfo from './CompanyInfo';
import PaymentMethods from './PaymentMethods';
import { NAVIGATION_LINKS } from './constants';
import { SOCIAL_BUTTONS } from 'components/features/SocialsButtons/constants';

interface Props {
	footer: IFooter;
}

const Footer: FC<Props> = ({ footer }) => {
	const theme = useTheme();

	const currentYear = new Date().getFullYear();

	return (
		<Box
			component='footer'
			bgcolor={theme.palette.custom.black}
			sx={{
				padding: {
					xs: `${theme.spacing(2.5)} 0 ${theme.spacing(5)}`,
					md: `${theme.spacing(5)} 0 ${theme.spacing(2)}`
				}
			}}
			role='contentinfo'
		>
			<Container>
				<Box
					display='flex'
					justifyContent='space-between'
					alignItems={{ xs: 'center', md: 'flex-start' }}
					flexDirection={{ xs: 'column', md: 'row' }}
					mb={{ xs: 0, md: 2 }}
				>
					{/* Contact Information */}
					<Box mb={3}>
						<ContactInfo theme={theme} />
						<SocialButtons />
					</Box>

					{/* Product Navigation */}
					<Box mb={3} textAlign={{ xs: 'center', md: 'left' }}>
						<NavigationLinks links={NAVIGATION_LINKS.products} theme={theme} />
					</Box>

					{/* Company Navigation */}
					<Box mb={3} textAlign={{ xs: 'center', md: 'left' }}>
						<NavigationLinks links={NAVIGATION_LINKS.company} theme={theme} />
					</Box>

					{/* Legal and Company Info */}
					<Box mb={3} textAlign={{ xs: 'center', md: 'left' }}>
						{NAVIGATION_LINKS.legal.map(({ label, href }) => (
							<Typography key={label} mb={1} color={theme.palette.custom['text-muted']}>
								<NextLink href={href}>{label}</NextLink>
							</Typography>
						))}
						<CompanyInfo showOnMobile={false} theme={theme} />
						<PaymentMethods />
						<CompanyInfo showOnMobile={true} theme={theme} />
					</Box>
				</Box>

				{/* Footer Text */}
				<Box maxWidth={800} margin='auto' textAlign='center' mb={1} color={theme.palette.custom['text-muted']}>
					<ReactMarkdown variant='body2' content={footer.textAfterPayments} />
				</Box>

				{/* Copyright */}
				<Typography textAlign='center' variant='body1' color={theme.palette.custom['text-inverse']}>
					© 2009–{currentYear}
				</Typography>
			</Container>
		</Box>
	);
};

export default Footer;
