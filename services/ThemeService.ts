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
			}
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
				default: '#f1f2f6',
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
				'text-muted': '#7A7F89'
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
			}
		}
	});
