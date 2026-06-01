import { SxProps, Theme } from '@mui/material';

export const headerSearchContainerSx: SxProps<Theme> = {
	display: 'flex',
	flex: 1,
	height: { xs: 40, md: 48 },
	border: '2px solid',
	borderColor: 'primary.main',
	borderRadius: { xs: '8px', md: '12px' },
	overflow: 'hidden',
	bgcolor: 'background.paper'
};

export const headerSearchInputSx: SxProps<Theme> = {
	flex: 1,
	height: '100%',
	px: { xs: 1, sm: 1.5, md: 2 },
	border: 'none',
	borderRadius: 0,
	boxShadow: 'none',
	bgcolor: 'transparent',
	minWidth: 0,
	'&.Mui-focused': {
		boxShadow: 'none'
	},
	'&::before, &::after': {
		display: 'none'
	},
	'& .MuiInputBase-input': {
		height: '100%',
		py: 0,
		boxSizing: 'border-box',
		textOverflow: 'ellipsis',
		'&::placeholder': {
			color: 'custom.text-muted',
			opacity: 1
		}
	}
};

export const headerSearchButtonSx: SxProps<Theme> = {
	borderRadius: 0,
	width: { xs: 40, md: 48 },
	minWidth: { xs: 40, md: 48 },
	height: '100%',
	flexShrink: 0,
	bgcolor: 'primary.main',
	color: 'primary.contrastText',
	'&:hover': {
		bgcolor: 'primary.dark'
	}
};
