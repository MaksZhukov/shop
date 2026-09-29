import { AppBar, Container } from '@mui/material';
import { CatalogMenu } from '../catalogMenu';
import { UserMenu } from '../userMenu';
import { HeaderMainBar } from './headerMainBar.component';
import { HeaderMobileMenuModal } from './headerMobileMenuModal.component';
import { HeaderMobileUtilityBar } from './headerMobileUtilityBar.component';
import { HeaderUtilityBar } from './headerUtilityBar.component';

export const Header = () => (
	<>
		<AppBar
			sx={{
				py: { xs: 1.5, md: 2 },
				borderBottom: '1px solid',
				borderColor: 'primary.main'
			}}
			color='secondary'
			position='fixed'
		>
			<Container>
				<HeaderUtilityBar />
				<HeaderMobileUtilityBar />
				<HeaderMainBar />
			</Container>
		</AppBar>

		<CatalogMenu />
		<UserMenu />
		<HeaderMobileMenuModal />
	</>
);
