import { Components, createTheme, Theme, ThemeOptions } from '@mui/material';
import { golos } from 'fonts';
import mediaQuery from 'css-mediaquery';

export type DeviceType = 'desktop' | 'mobile';

export const COLORS = {
	bgSurface1: '#F5F5F5',
	bgSurface3: '#E2E2E2',
	divider: '#D0D5DD'
} as const;

export const BREAKPOINTS = {
	xs: 0,
	sm: 600,
	md: 900,
	lg: 1456,
	xl: 1536
} as const;

export const TYPOGRAPHY = {
	fontSizes: {
		body1: '14px',
		body2: '12px',
		h6: '22px'
	}
} as const;

export const BUTTON_SIZES = {
	small: {
		height: '32px',
		padding: '8px 16px',
		fontSize: '14px'
	},
	medium: {
		height: '40px',
		padding: '10px 16px',
		fontSize: '16px'
	},
	large: {
		height: '48px',
		padding: '14px 16px',
		fontSize: '16px'
	}
} as const;

export const INPUT_SIZES = {
	small: {
		height: '32px',
		padding: '8px 12px',
		fontSize: '14px'
	},
	medium: {
		height: '40px',
		padding: '10px 12px',
		fontSize: '16px'
	}
} as const;

const createTypographyConfig = () => ({
	fontFamily: golos.style.fontFamily,
	body1: {
		fontSize: TYPOGRAPHY.fontSizes.body1
	},
	body2: {
		fontSize: TYPOGRAPHY.fontSizes.body2
	},
	h6: {
		fontSize: TYPOGRAPHY.fontSizes.h6
	}
});

const createPaletteConfig = () => ({
	primary: {
		main: '#17181C',
		contrastText: '#fff'
	},
	secondary: {
		main: '#fff',
		contrastText: '#fff',
		light: 'rgba(12, 21, 85, 0.3)',
		dark: 'rgba(12, 21, 85, 0.7)'
	},
	background: {
		default: '#EEEEEE',
		paper: '#fff'
	},
	text: {
		primary: '#40444D',
		secondary: '#1D1F23',
		disabled: 'rgba(0, 0, 0, 0.38)'
	},
	success: {
		main: '#00A110',
		light: '#81c784',
		dark: '#388e3c'
	},
	warning: {
		main: '#ff9800',
		light: '#ffb74d',
		dark: '#f57c00'
	},
	error: {
		main: '#f44336',
		light: '#e57373',
		dark: '#d32f2f'
	},
	info: {
		main: '#0081FF',
		light: '#64b5f6',
		dark: '#1976d2'
	},
	custom: {
		black: '#000',
		'text-inverse': '#fff',
		'text-muted': '#7A7F89',
		divider: COLORS.divider,
		shadow: '#1018281F',
		'bg-surface-4': '#CECECE',
		'muted-foreground': '#64748B',
		'bg-surface-1': COLORS.bgSurface1,
		'bg-surface-3': COLORS.bgSurface3
	}
});

const createComponentConfig = (deviceType: DeviceType): Components<Theme> => ({
	MuiUseMediaQuery: {
		defaultProps: {
			ssrMatchMedia: (query: string) => ({
				matches: mediaQuery.match(query, {
					width: deviceType === 'mobile' ? '0px' : '1024px'
				})
			})
		}
	},
	MuiContainer: {},
	MuiButton: {
		variants: [
			{
				props: { size: 'small' },
				style: BUTTON_SIZES.small
			},
			{
				props: { size: 'medium' },
				style: BUTTON_SIZES.medium
			},
			{
				props: { size: 'large' },
				style: BUTTON_SIZES.large
			}
		],
		styleOverrides: {
			root: {
				textTransform: 'none' as const,
				borderRadius: '6px',
				fontWeight: 500
			}
		}
	},
	MuiTab: {
		styleOverrides: {
			root: {
				textTransform: 'initial' as const
			}
		}
	},
	MuiAutocomplete: {
		styleOverrides: {
			inputRoot: {
				paddingBottom: '10px'
			},
			popupIndicator: {
				right: '6px'
			}
		}
	},
	MuiLink: {
		styleOverrides: {
			root: {
				textDecoration: 'none',
				color: '#40444D',
				fontWeight: 500,
				'&:hover': {
					color: '#7A7F89'
				},
				'&:focus': {
					color: '#1D1F23'
				},
				'&:disabled': {
					color: '#7A7F89A3'
				}
			}
		}
	},
	MuiInputBase: {
		variants: [
			{
				props: { size: 'small' },
				style: INPUT_SIZES.small
			},
			{
				props: { size: 'medium' },
				style: INPUT_SIZES.medium
			}
		],
		styleOverrides: {
			root: {
				border: `1px solid ${COLORS.bgSurface3}`,
				borderRadius: '6px',
				background: '#fff',
				'&:hover': {
					borderColor: '#7A7F89'
				},
				'&.Mui-focused': {
					boxShadow: '0px 0px 0px 2px #FCFCFD, 0px 0px 0px 4px #121212'
				},
				'&.Mui-disabled': {
					backgroundColor: COLORS.bgSurface1,
					border: `1px solid ${COLORS.divider}`
				},
				'&::before': {
					borderBottom: 'none!important'
				},
				'&::after': {
					borderBottom: 'none!important'
				}
			},
			input: {
				paddingLeft: '8px',
				paddingRight: '8px'
			}
		}
	},
	MuiAppBar: {
		styleOverrides: {
			root: {
				boxShadow: 'none',
				borderBottom: `1px solid ${COLORS.bgSurface3}`
			}
		}
	},
	MuiPopover: {
		styleOverrides: {
			paper: {
				backgroundColor: 'transparent',
				boxShadow: 'none'
			}
		}
	}
});

export const createCustomTheme = (deviceType: DeviceType): Theme => {
	const themeOptions: ThemeOptions = {
		breakpoints: {
			values: BREAKPOINTS
		},
		typography: createTypographyConfig(),
		palette: createPaletteConfig(),
		components: createComponentConfig(deviceType)
	};

	return createTheme(themeOptions);
};
