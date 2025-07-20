import { ArrowUpward, LocalPhone } from '@mui/icons-material';
import { Box, Button, createTheme, ThemeProvider, Container, IconButton } from '@mui/material';
import Breadcrumbs from 'components/Breadcrumbs';
import HeadSEO from 'components/HeadSEO';
import SEOBox from 'components/SEOBox';
import { Provider } from 'mobx-react';
import type { AppProps } from 'next/app';
import NextApp from 'next/app';
import { useRouter } from 'next/router';
import { SnackbarProvider } from 'notistack';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import NotistackService from 'services/NotistackService';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import 'react-multi-carousel/lib/styles.css';
import dynamic from 'next/dynamic';
import { UAParser } from 'ua-parser-js';
import Content from '../components/Content';
import Header from '../components/Header';
import Layout from '../components/Layout';
import RouteShield from '../components/RouteShield/RouteShield';
import { getJwt, saveJwt } from '../services/LocalStorageService';
import { store } from '../store';
import { createCustomTheme } from 'services/ThemeService';
import './app.scss';
import { ScrollUp } from 'components/features/ScrollUp';

const Footer = dynamic(() => import('components/Footer'));

function MyApp({
	Component,
	pageProps: { hasGlobalContainer = true, hideSEOBox = false, layout, ...restPageProps },
	deviceType
}: AppProps & { deviceType: 'desktop' | 'mobile' }) {
	const router = useRouter();
	const [renderBeforeFooter, setRenderBeforeFooter] = useState<ReactElement | null>(null);

	const theme = useMemo(() => createCustomTheme(deviceType), [deviceType]);

	useEffect(() => {
		const tryFetchData = async () => {
			let token = getJwt();
			if (token) {
				store.user.setJWT(token);
				try {
					await Promise.all([
						store.user.loadInfo(),
						// store.cart.loadShoppingCart(),
						store.favorites.loadFavorites()
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
			<Component
				{...restPageProps}
				socials={layout.footer?.socials}
				setRenderBeforeFooter={setRenderBeforeFooter}
			/>
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
			{renderBeforeFooter}
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
			// send(
			// 	'Nextjs FE Error',
			// 	`<b>URL</b>: ${router.asPath} <br /><b>Name</b>: ${error.name} <br /> <b>Message</b>: ${error.message} <br /> <b>Stack</b>: ${error.stack} <br />`,
			// 	publicRuntimeConfig.emailFEErrors
			// );
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
						<ScrollUp />
					</Layout>
				</SnackbarProvider>
			</Provider>
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
