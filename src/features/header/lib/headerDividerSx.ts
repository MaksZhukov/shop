import type { Theme } from '@mui/material';
import type { SystemStyleObject } from '@mui/system';

export const headerSectionDividerSx: SystemStyleObject<Theme> = {
	borderBottom: '1px solid',
	borderColor: 'custom.divider'
};

export const headerBottomDividerSx: SystemStyleObject<Theme> = {
	borderBottom: '1px solid',
	borderColor: 'primary.main'
};

export const headerFullWidthTopDividerSx: SystemStyleObject<Theme> = {
	position: 'relative',
	'&::before': {
		content: '""',
		position: 'absolute',
		top: 0,
		left: '-50vw',
		width: '150vw',
		height: '1px',
		backgroundColor: 'custom.divider'
	}
};
