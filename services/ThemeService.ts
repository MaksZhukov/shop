import { createTheme, Theme } from '@mui/material';
import { golos } from 'fonts';
import mediaQuery from 'css-mediaquery';

// Extend the theme to include custom properties
declare module '@mui/material/styles' {
	interface Palette {
		custom: {
			black: string;
			'dark-gray': string;
			'light-gray': string;
			'medium-gray': string;
			'text-inverse': string;
			'text-muted': string;
			divider: string;
			'bg-surface-4': string;
		};
	}
	interface PaletteOptions {
		custom?: {
			black?: string;
			'dark-gray'?: string;
			'light-gray'?: string;
			'medium-gray'?: string;
			'text-inverse'?: string;
			'text-muted'?: string;
			divider?: string;
			'bg-surface-4'?: string;
		};
	}
}

export const createCustomTheme = (deviceType: 'desktop' | 'mobile') =>
	createTheme({
		breakpoints: {
			values: {
				xs: 0,
				sm: 600,
				md: 900,
				lg: 1456,
				xl: 1536
			}
		},
		typography: {
			fontFamily: golos.style.fontFamily,
			body1: {
				fontSize: '14px'
			},
			body2: {
				fontSize: '12px'
			},
			h6: { fontSize: '22px' }
		},
		palette: {
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
			// Add custom colors for backgrounds
			background: {
				default: '#EEEEEE',
				paper: '#fff'
			},
			// Add custom text colors
			text: {
				primary: '#40444D',
				secondary: '#1D1F23',
				disabled: 'rgba(0, 0, 0, 0.38)'
			},
			// Add custom colors for different states
			success: {
				main: '#4caf50',
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
			// Add custom colors for specific use cases
			info: {
				main: '#2196f3',
				light: '#64b5f6',
				dark: '#1976d2'
			},
			// Custom colors
			custom: {
				black: '#000',
				'text-inverse': '#fff',
				'text-muted': '#7A7F89',
				divider: '#D0D5DD',
				'bg-surface-4': '#CECECE'
			}
		},
		// Add custom component styles
		components: {
			MuiUseMediaQuery: {
				defaultProps: {
					ssrMatchMedia: (query) => ({
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
						style: {
							height: '32px',
							padding: '8px 16px',
							fontSize: '14px'
						}
					},
					{
						props: { size: 'medium' },
						style: {
							height: '40px',
							padding: '10px 16px',
							fontSize: '16px'
						}
					},
					{
						props: { size: 'large' },
						style: {
							height: '48px',
							padding: '14px 16px',
							fontSize: '16px'
						}
					}
				],
				styleOverrides: {
					root: {
						textTransform: 'none',
						borderRadius: '6px',
						fontWeight: 500
					}
				}
			},
			MuiTab: {
				styleOverrides: {
					root: { textTransform: 'initial' }
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
						style: {
							height: '32px',
							padding: '8px 12px',
							fontSize: '14px'
						}
					},
					{
						props: { size: 'medium' },
						style: {
							height: '40px',
							padding: '10px 12px',
							fontSize: '16px'
						}
					}
				],
				styleOverrides: {
					root: {
						border: '1px solid #E2E2E2',
						borderRadius: '6px',
						background: '#fff',
						'&:hover': {
							borderColor: '#7A7F89'
						},
						'&.Mui-focused': {
							boxShadow: '0px 0px 0px 2px #FCFCFD, 0px 0px 0px 4px #121212'
						},
						'&.Mui-disabled': {
							backgroundColor: '#F5F5F5',
							border: '1px solid #D0D5DD'
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
						borderBottom: '1px solid #E2E2E2'
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
		}
	});
