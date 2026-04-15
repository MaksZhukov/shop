import { Box, Typography, Container, useTheme } from '@mui/material';
import NextLink from 'next/link';
import { FC } from 'react';
import ContactInfo from './ContactInfo';
import { SocialButtons } from 'shared/ui';
import NavigationLinks from './NavigationLinks';
import CompanyInfo from './CompanyInfo';
import PaymentMethods from './PaymentMethods';
import { NAVIGATION_LINKS, MOBILE_BOTTOM_NAV_HEIGHT } from '../footerConstants';

export const Footer: FC = () => {
	const theme = useTheme();

	const currentYear = new Date().getFullYear();

	return (
        <Box
            component='footer'
            role='contentinfo'
            sx={{
                bgcolor: 'custom.black',
                marginBottom: { xs: `${MOBILE_BOTTOM_NAV_HEIGHT}px`, md: 0 },

                padding: {
					xs: `${theme.spacing(3)} 0 ${theme.spacing(2.5)}`,
					md: `${theme.spacing(5)} 0 ${theme.spacing(2)}`
				}
            }}>
            <Container>
				<Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: { xs: 'center', md: 'flex-start' },
                        flexDirection: { xs: 'column', md: 'row' },
                        mb: { xs: 0, md: 2 }
                    }}>
					{/* Contact Information */}
					<Box sx={{
                        mb: 3
                    }}>
						<ContactInfo />
						<SocialButtons />
					</Box>

					{/* Product Navigation */}
					<Box
                        sx={{
                            mb: 3,
                            textAlign: { xs: 'center', md: 'left' }
                        }}>
						<NavigationLinks links={NAVIGATION_LINKS.products} />
					</Box>

					{/* Company Navigation */}
					<Box
                        sx={{
                            mb: 3,
                            textAlign: { xs: 'center', md: 'left' }
                        }}>
						<NavigationLinks links={NAVIGATION_LINKS.company} />
					</Box>

					{/* Legal and Company Info */}
					<Box
                        sx={{
                            mb: 3,
                            textAlign: { xs: 'center', md: 'left' }
                        }}>
						{NAVIGATION_LINKS.legal.map(({ label, href }) => (
							<Typography key={label} sx={{ mb: 1, color: 'custom.text-muted' }}>
								<NextLink href={href}>{label}</NextLink>
							</Typography>
						))}
						<CompanyInfo showOnMobile={false} />
						<CompanyInfo showOnMobile={true} />
					</Box>
				</Box>

				<Box
                    sx={{
                        mb: 1,
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'center', md: 'flex-start' }
                    }}>
					<Box
                        sx={{
                            textAlign: { xs: 'center', md: 'left' },
                            maxWidth: 800,
                            mb: { xs: 2, md: 0 }
                        }}>
						<Typography variant='body2' sx={{ mb: 1, color: 'custom.text-muted' }}>
							Свидетельство выдано Гродненским горисполкомом 03.11.2008. Регистрация в Торговом реестре
							18.11.2022. Юр. адрес: 231710, Гродненская область, Гродненский район, с/с
							Коптевский, д.. Полотково
						</Typography>
						<Typography variant='body1' sx={{ color: 'custom.text-inverse' }}>
							© 2009–{currentYear}
						</Typography>
					</Box>
					<PaymentMethods />
				</Box>
			</Container>
        </Box>
    );
};
