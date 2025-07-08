import { createTheme } from '@mui/material';
import { COLORS } from 'config';
import { golos } from 'fonts';
import mediaQuery from 'css-mediaquery';

export const createCustomTheme = (deviceType: 'desktop' | 'mobile') =>
	createTheme({
		typography: {
			fontFamily: golos.style.fontFamily
		},
		palette: {
			primary: {
				main: COLORS.Primary,
				contrastText: '#fff'
			},
			secondary: {
				main: COLORS.Secondary,
				contrastText: '#fff'
			}
		},
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
