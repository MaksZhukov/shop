import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'mobx-react';
import { store } from '../store';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Content from '../components/Content';
import Layout from '../components/Layout';
import { createTheme, Snackbar, Stack, ThemeProvider } from '@mui/material';
import { green, lightGreen, lime, red, grey } from '@mui/material/colors';
import { useEffect } from 'react';
import {
	getCartProductIDs,
	getFavoriteProductIDs,
	getJwt,
	getReviewEmail,
	saveJwt,
} from '../services/LocalStorageService';
import Notification from '../components/Notification';
import RouteShield from '../components/RouteShield/RouteShield';
import { fetchProducts } from 'api/products/products';
import { Favorite } from 'api/favorites/types';
import { ShoppingCartItem } from 'api/cart/types';

let theme = createTheme({
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

				const [cartItems, favoriteItems, data] = await Promise.all([
					store.cart.getShoppingCartByLocalStorage(),
					store.favorites.getFavoritesByLocalStorage(),
					...(email ? [store.user.loadReviewStatus(email)] : []),
				]);
				store.cart.setCartItems(cartItems);
				store.favorites.setFavorites(favoriteItems);
			}
			store.setIsInitialRequestDone();
		};
		tryFetchData();
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<Provider store={store}>
				<Layout>
					<Header></Header>
					<Content>
						<RouteShield>
							<Component {...pageProps} />
						</RouteShield>
					</Content>
					<Footer></Footer>
					<Notification></Notification>
				</Layout>
			</Provider>
		</ThemeProvider>
	);
}

export default MyApp;
