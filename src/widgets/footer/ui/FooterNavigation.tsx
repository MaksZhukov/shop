import { Box, Typography } from '@mui/material';
import { FC } from 'react';
import { sectionTitleSx } from '../lib/sectionTitleSx';
import { FOOTER_CATALOG_LINKS, FOOTER_INFO_LINKS } from '../footerConstants';
import { FooterAuthLink } from './FooterAuthLink';
import { NavigationLinks } from './NavigationLinks';

interface FooterNavigationProps {
	onSignInClick: () => void;
}

export const FooterNavigation: FC<FooterNavigationProps> = ({ onSignInClick }) => (
	<Box sx={{ py: { xs: 1, md: 2 } }}>
		<Box
			sx={{
				display: 'flex',
				flexDirection: { xs: 'column', md: 'row' },
				alignItems: 'flex-start',
				gap: { xs: 3, md: 10, lg: 14 }
			}}
		>
			<Box sx={{ width: { xs: '100%', md: 'auto' } }}>
				<Typography sx={sectionTitleSx}>Информация</Typography>
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: { xs: '1fr 1fr', md: 'max-content max-content' },
						columnGap: { xs: 3, sm: 6, md: 10, lg: 14 }
					}}
				>
					<NavigationLinks links={FOOTER_INFO_LINKS.columnA} />
					<Box sx={{ display: 'flex', flexDirection: 'column' }}>
						<NavigationLinks links={FOOTER_INFO_LINKS.columnB} />
						<FooterAuthLink onSignInClick={onSignInClick} />
						<NavigationLinks links={FOOTER_INFO_LINKS.columnBAfterAuth} />
					</Box>
				</Box>
			</Box>

			<Box sx={{ width: { xs: '100%', md: 'auto' } }}>
				<Typography sx={sectionTitleSx}>Каталог</Typography>
				<NavigationLinks links={FOOTER_CATALOG_LINKS} />
			</Box>
		</Box>
	</Box>
);
