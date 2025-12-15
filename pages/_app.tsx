import { Container } from '@mui/material';
import { Breadcrumbs } from 'shared/ui';
import { HeadSEO } from 'app';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import dynamic from 'next/dynamic';
import { Header } from '../widgets/header';
import { Footer } from '../widgets/footer';
import { Layout } from 'shared/ui';
import { RouteShield } from 'features/routeShield';
import { authLocalStorage } from 'entities/user/authLocalStorage';
import { store } from 'app/providers/StoreProvider';
import { QueryProvider } from 'app/providers/QueryProvider';
import { ThemeProvider } from 'app/providers/ThemeProvider';
import { StoreProvider } from 'app/providers/StoreProvider';
import { SnackbarProvider } from 'app/providers/SnackbarProvider';
import { ApiProvider } from 'app/providers/ApiProvider';
import { useLoadFavorites } from 'features/favorites/useLoadFavorites';
import { useLoadCart } from 'features/cart/useLoadCart';
import { useSetJWT } from 'features/user/useSetJWT';
import { useLoadUserInfo } from 'features/user/useLoadUserInfo';
import './app.scss';

const ScrollUp = dynamic(() => import('features/scrollUp').then((mod) => ({ default: mod.ScrollUp })), {
	ssr: false
});

function AppContent({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const loadFavorites = useLoadFavorites();
	const loadCart = useLoadCart();
	const setJWT = useSetJWT();
	const loadUserInfo = useLoadUserInfo();

	useEffect(() => {
		const tryFetchData = async () => {
			let token = authLocalStorage.getJwt();
			if (token) {
				setJWT(token);
				try {
					await Promise.all([loadUserInfo(), loadCart(), loadFavorites()]);
				} catch (err) {
					authLocalStorage.removeJwt();
				}
			} else {
				await Promise.all([loadCart(), loadFavorites()]);
			}
			store.setIsInitialRequestDone();
		};
		tryFetchData();
	}, [loadFavorites, loadCart, setJWT, loadUserInfo]);

	const getHeadSEOImage = () => {
		let image = null;
		if (pageProps.data) {
			Object.keys(pageProps.data).forEach((key) => {
				if (key.includes('image') || key.includes('banner')) {
					image =
						Array.isArray(pageProps.data[key]) && pageProps.data[key][0]?.url
							? pageProps.data[key][0]
							: pageProps.data[key]?.url
							? pageProps.data[key]
							: null;
				}
			});
			if (image) {
				return image;
			}
		}
		if (pageProps.page) {
			Object.keys(pageProps.page).forEach((key) => {
				if (key.includes('image')) {
					image =
						Array.isArray(pageProps.page[key]) && pageProps.page[key][0]?.url
							? pageProps.page[key][0]
							: pageProps.page[key]?.url
							? pageProps.page[key]
							: null;
				}
			});
			if (image) {
				return image;
			}
		}
		return image;
	};
	const handleRenderError = (error: Error) => {
		if (process.env.NODE_ENV === 'production') {
			// send(
			// 	'Nextjs FE Error',
			// 	`<b>URL</b>: ${router.asPath} <br /><b>Name</b>: ${error.name} <br /> <b>Message</b>: ${error.message} <br /> <b>Stack</b>: ${error.stack} <br />`,
			// 	emailFEErrors
			// );
			router.push('/500', undefined, { shallow: true });
		} else {
			console.error(error);
		}
	};

	return (
		<Layout>
			<HeadSEO
				title={pageProps.page?.seo?.title}
				description={pageProps.page?.seo?.description}
				keywords={pageProps.page?.seo?.keywords}
				image={getHeadSEOImage()}
			></HeadSEO>
			<Header />
			<RouteShield>
				<ErrorBoundary fallback={<></>} onError={handleRenderError}>
					<Breadcrumbs breadcrumbs={pageProps.breadcrumbs || []}></Breadcrumbs>
					<Container sx={{ flex: 1 }}>
						<Component {...pageProps} />
					</Container>
				</ErrorBoundary>
			</RouteShield>
			<Footer />
			<ScrollUp />
		</Layout>
	);
}

const App = (props: AppProps) => (
	<ThemeProvider>
		<QueryProvider>
			<StoreProvider>
				<ApiProvider>
					<SnackbarProvider>
						<AppContent {...props} />
					</SnackbarProvider>
				</ApiProvider>
			</StoreProvider>
		</QueryProvider>
	</ThemeProvider>
);

export default App;
