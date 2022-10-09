import '../styles/globals.css';
import TawkTo from 'tawkto-react';
import type { AppProps } from 'next/app';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';
import { Provider } from 'mobx-react';
import { store } from '../store';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Content from '../components/Content';
import Layout from '../components/Layout';
import { createTheme, Snackbar, Stack, ThemeProvider } from '@mui/material';
import { green } from '@mui/material/colors';
import { useEffect, useRef } from 'react';
import {
	getJwt,
	getReviewEmail,
	saveJwt,
} from '../services/LocalStorageService';
import RouteShield from '../components/RouteShield/RouteShield';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './app.scss';
import NotistackService from 'services/NotistackService';

const propertyId = '62e2456354f06e12d88bbae4';
const tawkId = '1g91tu3hb';

let theme = createTheme({
	typography: {
		fontFamily: 'Roboto',
	},
	palette: {
		primary: {
			...green,
			contrastText: '#fff',
		},
	},
});

function MyApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
		const tryFetchData = async () => {
			let token = getJwt();
			if (token) {
				store.user.setJWT(token);
				try {
					await Promise.all([
						store.user.loadInfo(),
						store.cart.loadShoppingCart(),
						store.favorites.loadFavorites(),
					]);
				} catch (err) {
					saveJwt('');
				}
			} else {
				const email = getReviewEmail();

				await Promise.all([
					store.cart.loadShoppingCart(),
					store.favorites.loadFavorites(),
					...(email ? [store.user.loadReviewStatus(email)] : []),
				]);
			}
			store.setIsInitialRequestDone();
		};
		tryFetchData();
		// Timeout needs to resolve prod cors error
		setTimeout(() => {
			new TawkTo(propertyId, tawkId);
		}, 1000);
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<Provider store={store}>
				<SnackbarProvider
					autoHideDuration={3000}
					ref={(ref) => {
						if (ref) {
							NotistackService.setRef(ref);
						}
					}}
					maxSnack={3}>
					<Layout>
						<Header></Header>
						<Content>
							<RouteShield>
								<Component {...pageProps} />
							</RouteShield>
						</Content>
						<Footer></Footer>
					</Layout>
				</SnackbarProvider>
			</Provider>
		</ThemeProvider>
	);
}

export default MyApp;
