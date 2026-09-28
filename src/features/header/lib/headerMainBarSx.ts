import type { SxProps, Theme } from '@mui/material';
import { headerFullWidthTopDividerSx } from './headerDividerSx';

export const headerMainBarDesktopSx: SxProps<Theme> = {
	display: { xs: 'none', lg: 'flex' },
	gap: 2,
	pt: 1.5,
	alignItems: 'center',
	...headerFullWidthTopDividerSx
};

export const headerMainBarMobileSx: SxProps<Theme> = {
	display: { xs: 'flex', lg: 'none' },
	flexDirection: 'column',
	gap: 1.5,
	width: '100%',
	minWidth: 0
};

export const headerMainBarMobileLogoRowSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: 1,
	minWidth: 0,
	zIndex: 1,
	pt: 1.5,
	pb: { xs: 1.5, sm: 0 },
	...headerFullWidthTopDividerSx
};

export const headerMainBarMobileCatalogRowSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	gap: { xs: 1, sm: 1.5 },
	width: '100%',
	minWidth: 0
};
