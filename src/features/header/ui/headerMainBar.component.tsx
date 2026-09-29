import { Box } from '@mui/material';
import { FC } from 'react';
import { BrandLogo } from 'shared/ui';
import {
	headerMainBarDesktopSx,
	headerMainBarMobileCatalogRowSx,
	headerMainBarMobileLogoRowSx,
	headerMainBarMobileSx
} from '../lib/headerMainBarSx';
import { CatalogButton } from '../catalogMenu';
import { HeaderSearch } from '../search';
import { HeaderMobileUserActions, HeaderUserActions } from '../userMenu';

export const HeaderMainBar: FC = () => {
	return (
		<>
			<Box sx={headerMainBarDesktopSx}>
				<BrandLogo sx={{ flexShrink: 0 }} />
				<CatalogButton />
				<HeaderSearch />
				<HeaderUserActions />
			</Box>

			<Box sx={headerMainBarMobileSx}>
				<Box sx={headerMainBarMobileLogoRowSx}>
					<BrandLogo compact sx={{ flexShrink: 1, minWidth: 0 }} />
					<Box sx={{ display: { xs: 'flex', sm: 'none' }, flexShrink: 0 }}>
						<HeaderMobileUserActions />
					</Box>
					<Box sx={{ display: { xs: 'none', sm: 'flex' }, flexShrink: 0 }}>
						<HeaderUserActions />
					</Box>
				</Box>

				<Box sx={headerMainBarMobileCatalogRowSx}>
					<CatalogButton />
					<HeaderSearch />
				</Box>
			</Box>
		</>
	);
};
