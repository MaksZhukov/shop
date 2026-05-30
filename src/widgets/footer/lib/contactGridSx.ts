import { SxProps, Theme } from '@mui/material';

export const contactGridSx: SxProps<Theme> = {
	display: 'grid',
	gap: 3,
	columnGap: 4,
	py: { xs: 3, md: 4 },
	alignItems: { xs: 'start', md: 'center' },
	gridTemplateColumns: {
		xs: '1fr 1fr',
		md: 'auto 1fr max-content',
		lg: 'auto minmax(0, max-content) max-content max-content auto'
	},
	gridTemplateAreas: {
		xs: `"logo email"
		     "phone button"`,
		md: `"logo address email phone button"`,
		lg: `"logo address email phone button"`
	}
};
