import { Box, Typography, Container, useTheme } from '@mui/material';
import { Footer as IFooter } from 'api/layout/types';
import ReactMarkdown from 'components/ReactMarkdown';
import NextLink from 'next/link';
import { FC } from 'react';
import ContactInfo from './ContactInfo';
import { SocialButtons } from '../SocialsButtons';
import NavigationLinks from './NavigationLinks';
import CompanyInfo from './CompanyInfo';
import PaymentMethods from './PaymentMethods';
import { NAVIGATION_LINKS } from './constants';
import { MOBILE_BOTTOM_NAV_HEIGHT } from '../../../constants';

const Footer: FC = () => {
	const theme = useTheme();

	const currentYear = new Date().getFullYear();

	return (
		<Box
			component='footer'
			bgcolor={theme.palette.custom.black}
			sx={{
				marginBottom: { xs: `${MOBILE_BOTTOM_NAV_HEIGHT}px`, md: 0 },
				padding: {
					xs: `${theme.spacing(3)} 0 ${theme.spacing(2.5)}`,
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
						<CompanyInfo showOnMobile={true} theme={theme} />
					</Box>
				</Box>

				<Box
					mb={1}
					display='flex'
					flexDirection={{ xs: 'column', md: 'row' }}
					justifyContent='space-between'
					alignItems={{ xs: 'center', md: 'flex-start' }}
				>
					<Box textAlign={{ xs: 'center', md: 'left' }} maxWidth={800} mb={{ xs: 2, md: 0 }}>
						<Typography mb={1} variant='body2' color={theme.palette.custom['text-muted']}>
							Свидетельство выдано Гродненским горисполкомом 03.11.2008. Регистрация в Торговом реестре
							18.11.2022. Юр. адрес: 231710, Гродненская область, Гродненский район, с/с
							Коптевский, д.. Полотково
						</Typography>
						<Typography variant='body1' color={theme.palette.custom['text-inverse']}>
							© 2009–{currentYear}
						</Typography>
					</Box>
					<PaymentMethods />
				</Box>
			</Container>
		</Box>
	);
};

export default Footer;
