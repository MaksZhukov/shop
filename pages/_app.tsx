import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'mobx-react';
import { store } from '../store';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Content from '../components/Content';
import Layout from '../components/Layout';
import { createTheme, Link, Snackbar, Stack, ThemeProvider } from '@mui/material';
import { green } from '@mui/material/colors';
import { useEffect, useRef, useState } from 'react';
import { getJwt, getReviewEmail, saveJwt } from '../services/LocalStorageService';
import RouteShield from '../components/RouteShield/RouteShield';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './app.scss';
import NotistackService from 'services/NotistackService';
import { fetchBrands } from 'api/brands/brands';
import { MAX_LIMIT } from 'api/constants';
import { Brand } from 'api/brands/types';
import Typography from 'components/Typography';
import Breadcrumbs from 'components/Breadcrumbs';
import HeadSEO from 'components/HeadSEO';
import { Container } from '@mui/system';
import SEOBox from 'components/SEOBox';

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

function MyApp({
	Component,
	pageProps: {
		layout: { footer },
		...restPageProps
	},
}: AppProps) {
	const [brands, setBrands] = useState<Brand[]>(restPageProps.brands ?? []);
	useEffect(() => {
		const tryFetchData = async () => {
			let token = getJwt();
			if (token) {
				store.user.setJWT(token);
				try {
					await Promise.all([
						store.user.loadInfo(),
						// store.cart.loadShoppingCart(),
						store.favorites.loadFavorites(),
					]);
				} catch (err) {
					saveJwt('');
				}
			} else {
				const email = getReviewEmail();

				await Promise.all([
					// store.cart.loadShoppingCart(),
					store.favorites.loadFavorites(),
					...(email ? [store.user.loadReviewStatus(email)] : []),
				]);
			}
			store.setIsInitialRequestDone();
		};
		const fetchBrandsData = async () => {
			if (!brands.length) {
				const { data } = await fetchBrands({
					pagination: { limit: MAX_LIMIT },
				});
				setBrands(data.data);
			}
		};
		tryFetchData();
		fetchBrandsData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
					maxSnack={3}
				>
					<Layout>
						<HeadSEO
							title={restPageProps.page?.seo?.title}
							description={restPageProps.page?.seo?.description}
							keywords={restPageProps.page?.seo?.description}
						></HeadSEO>
						<Header brands={brands}></Header>
						<RouteShield>
							<Content>
								<Container>
									<Breadcrumbs h1={restPageProps.data?.h1}></Breadcrumbs>
									<Component {...restPageProps} brands={brands} />
									<SEOBox
										images={restPageProps.page?.seo?.images}
										content={restPageProps.page?.seo?.content}
									></SEOBox>
								</Container>
							</Content>
						</RouteShield>
						<Footer footer={footer}></Footer>
					</Layout>
				</SnackbarProvider>
			</Provider>
		</ThemeProvider>
	);
}

export default MyApp;
