import { LocalPhone } from '@mui/icons-material';
import { Box, Button, createTheme, ThemeProvider } from '@mui/material';
import { Container } from '@mui/system';
import { send } from 'api/email';
import Breadcrumbs from 'components/Breadcrumbs';
import HeadSEO from 'components/HeadSEO';
import Metrics from 'components/Metrics';
import SEOBox from 'components/SEOBox';
import mediaQuery from 'css-mediaquery';
import { roboto } from 'fonts';
import { Provider } from 'mobx-react';
import type { AppProps } from 'next/app';
import NextApp from 'next/app';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { SnackbarProvider } from 'notistack';
import { useEffect, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import NotistackService from 'services/NotistackService';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import parser from 'ua-parser-js';
import Content from '../components/Content';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Layout from '../components/Layout';
import RouteShield from '../components/RouteShield/RouteShield';
import { getJwt, saveJwt } from '../services/LocalStorageService';
import { store } from '../store';
import './app.scss';

const { publicRuntimeConfig } = getConfig();

function MyApp({
	Component,
	pageProps: { hasGlobalContainer = true, hideSEOBox = false, layout, ...restPageProps },
	deviceType,
}: AppProps & { deviceType: 'desktop' | 'mobile' }) {
	const router = useRouter();
	let theme = useMemo(
		() =>
			createTheme({
				typography: {
					fontFamily: roboto.style.fontFamily,
				},
				palette: {
					primary: {
						main: '#fdb819',
						contrastText: '#fff',
					},
					secondary: {
						main: '#0C1555',
					},
				},
				components: {
					MuiUseMediaQuery: {
						defaultProps: {
							ssrMatchMedia: (query) => ({
								matches: mediaQuery.match(query, {
									width: deviceType === 'mobile' ? '0px' : '1024px',
								}),
							}),
						},
					},
				},
			}),
		[]
	);

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
				await store.favorites.loadFavorites();
			}
			store.setIsInitialRequestDone();
		};
		tryFetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const renderContent = (
		<>
			<Component {...restPageProps} socials={layout.footer?.socials} />
			{!hideSEOBox && (
				<>
					{!hasGlobalContainer ? (
						<Container>
							<SEOBox
								images={restPageProps.page?.seo?.images}
								content={restPageProps.page?.seo?.content}
								h1={restPageProps.page?.seo?.h1}
							></SEOBox>
						</Container>
					) : (
						<SEOBox
							h1={restPageProps.page?.seo?.h1}
							images={restPageProps.page?.seo?.images}
							content={restPageProps.page?.seo?.content}
						></SEOBox>
					)}
				</>
			)}
		</>
	);

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
			send(
				'Razbor Auto FE Error',
				`<b>URL</b>: ${router.asPath} <br /><b>Name</b>: ${error.name} <br /> <b>Message</b>: ${error.message} <br /> <b>Stack</b>: ${error.stack} <br />`,
				publicRuntimeConfig.emailFEErrors
			);
			router.push('/500', undefined, { shallow: true });
		} else {
			console.error(error);
		}
	};

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
						{process.env.NODE_ENV === 'production' && <Metrics></Metrics>}
						<HeadSEO
							title={restPageProps.page?.seo?.title}
							description={restPageProps.page?.seo?.description}
							keywords={restPageProps.page?.seo?.keywords}
							image={getHeadSEOImage()}
						></HeadSEO>
						<Header brands={restPageProps.brands}></Header>
						<RouteShield>
							<Content>
								<ErrorBoundary fallback={<></>} onError={handleRenderError}>
									<Breadcrumbs
										exclude={['buyback-cars']}
										h1={restPageProps.data?.h1 || restPageProps.page?.name}
									></Breadcrumbs>
									{hasGlobalContainer ? <Container>{renderContent}</Container> : renderContent}
								</ErrorBoundary>
							</Content>
						</RouteShield>
						<Footer footer={layout.footer}></Footer>
						<Box bottom={10} right={10} zIndex={10} position='fixed'>
							<Button
								sx={{ minWidth: '50px', height: '50px', borderRadius: ' 50%', padding: '0' }}
								variant='contained'
								component='a'
								href='tel:+375297804780'
							>
								<LocalPhone></LocalPhone>
							</Button>
						</Box>
					</Layout>
				</SnackbarProvider>
			</Provider>
		</ThemeProvider>
	);
}

MyApp.getInitialProps = (context: any) => ({
	...NextApp.getInitialProps(context),
	deviceType: context.ctx.req ? parser(context.ctx.req.headers['user-agent']).device.type || 'desktop' : 'desktop',
});

export default MyApp;
