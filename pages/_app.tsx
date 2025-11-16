import { Container } from '@mui/material';
import Breadcrumbs from 'components/features/Breadcrumbs';
import HeadSEO from 'components/features/HeadSEO';
import type { AppProps } from 'next/app';
import NextApp from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import dynamic from 'next/dynamic';
import { UAParser } from 'ua-parser-js';
import Header from '../components/features/Header';
import Footer from '../components/features/Footer';
import Layout from '../components/features/Layout';
import RouteShield from '../components/features/RouteShield';
import { authService } from '../services/LocalStorageService';
import { store } from '../store';
import { QueryProvider } from 'components/providers/QueryProvider';
import { ThemeProvider } from 'components/providers/ThemeProvider';
import { StoreProvider } from 'components/providers/StoreProvider';
import { SnackbarProvider } from 'components/providers/SnackbarProvider';
import { emailFEErrors } from 'services/EnvService';
import './app.scss';

const ScrollUp = dynamic(() => import('components/features/ScrollUp').then((mod) => ({ default: mod.ScrollUp })), {
	ssr: false
});

function MyApp({
	Component,
	pageProps: { layout, ...restPageProps },
	deviceType
}: AppProps & { deviceType: 'desktop' | 'mobile' }) {
	const router = useRouter();
	useEffect(() => {
		const tryFetchData = async () => {
			let token = authService.getJwt();
			if (token) {
				store.user.setJWT(token);
				try {
					await Promise.all([
						store.user.loadInfo(),
						// store.cart.loadShoppingCart(),
						store.favorites.loadFavorites()
					]);
				} catch (err) {
					authService.removeJwt();
				}
			} else {
				await store.favorites.loadFavorites();
			}
			store.setIsInitialRequestDone();
		};
		tryFetchData();
	}, []);

	const getHeadSEOImage = () => {
		let image = null;
		if (restPageProps.data) {
			Object.keys(restPageProps.data).forEach((key) => {
				if (key.includes('image') || key.includes('banner')) {
					image =
						Array.isArray(restPageProps.data[key]) && restPageProps.data[key][0]?.url
							? restPageProps.data[key][0]
							: restPageProps.data[key]?.url
							? restPageProps.data[key]
							: null;
				}
			});
			if (image) {
				return image;
			}
		}
		if (restPageProps.page) {
			Object.keys(restPageProps.page).forEach((key) => {
				if (key.includes('image')) {
					image =
						Array.isArray(restPageProps.page[key]) && restPageProps.page[key][0]?.url
							? restPageProps.page[key][0]
							: restPageProps.page[key]?.url
							? restPageProps.page[key]
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
		<ThemeProvider deviceType={deviceType}>
			<QueryProvider>
				<StoreProvider>
					<SnackbarProvider>
						<Layout>
							<HeadSEO
								title={restPageProps.page?.seo?.title}
								description={restPageProps.page?.seo?.description}
								keywords={restPageProps.page?.seo?.keywords}
								image={getHeadSEOImage()}
							></HeadSEO>
							<Header />
							<RouteShield>
								<ErrorBoundary fallback={<></>} onError={handleRenderError}>
									<Breadcrumbs breadcrumbs={restPageProps.breadcrumbs || []}></Breadcrumbs>
									<Container sx={{ flex: 1 }}>
										<Component {...restPageProps} />
									</Container>
								</ErrorBoundary>
							</RouteShield>
							<Footer />
							<ScrollUp />
						</Layout>
					</SnackbarProvider>
				</StoreProvider>
			</QueryProvider>
		</ThemeProvider>
	);
}

MyApp.getInitialProps = (context: any) => {
	const deviceType = context.ctx.req ? UAParser(context.ctx.req.headers['user-agent']).device.type : 'desktop';
	const deviceTypeResult = deviceType === 'mobile' || deviceType === 'tablet' ? 'mobile' : 'desktop';
	return {
		...NextApp.getInitialProps(context),
		deviceType: deviceTypeResult
	};
};

export default MyApp;
