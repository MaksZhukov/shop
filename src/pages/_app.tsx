import { Container } from '@mui/material';
import { Breadcrumbs } from 'shared/ui';
import { HeadSEO } from 'app';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import dynamic from 'next/dynamic';
import { Layout } from 'shared/ui';
import { RouteShield } from 'features/routeShield';
import { DehydratedState, HydrationBoundary } from '@tanstack/react-query';
import { QueryProvider } from 'app/providers/QueryProvider';
import { ThemeProvider } from 'app/providers/ThemeProvider';
import { StoreProvider } from 'app/providers/StoreProvider';
import { SnackbarProvider } from 'app/providers/SnackbarProvider';
import { ApiProvider } from 'app/providers/ApiProvider';
import { useInitialAuthLoad } from 'features/user/useInitialAuthLoad';
import { Header } from 'widgets/header';
import { Footer } from 'widgets/footer';
import './app.scss';
import { RecaptchaProvider } from 'app/providers/RecaptchaProvider';

// Lazy load components that don't need SSR
const ScrollUp = dynamic(() => import('features/scrollUp').then((mod) => ({ default: mod.ScrollUp })), {
	ssr: false
});

function AppContent({ Component, pageProps }: AppProps) {
	const router = useRouter();
	useInitialAuthLoad();

	const seoImage = useMemo(() => {
		const findImage = (obj: any): any => {
			if (!obj) return null;

			for (const key in obj) {
				if (key.includes('image') || key.includes('banner')) {
					const value = obj[key];
					if (Array.isArray(value) && value[0]?.url) {
						return value[0];
					}
					if (value?.url) {
						return value;
					}
				}
			}
			return null;
		};

		return findImage(pageProps.data) || findImage(pageProps.page) || null;
	}, [pageProps.data, pageProps.page]);

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
				image={seoImage}
			></HeadSEO>
			<Header />
			<RouteShield>
				<ErrorBoundary fallback={<></>} onError={handleRenderError}>
					<Breadcrumbs breadcrumbs={pageProps.breadcrumbs || []}></Breadcrumbs>
					<Container sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
						<Component {...pageProps} />
					</Container>
				</ErrorBoundary>
			</RouteShield>
			<Footer />
			<ScrollUp />
		</Layout>
	);
}

const App = (props: AppProps<{ dehydratedState: DehydratedState }>) => (
	<ThemeProvider>
		<QueryProvider>
			<RecaptchaProvider>
				<HydrationBoundary state={props.pageProps?.dehydratedState}>
					<StoreProvider>
						<ApiProvider>
							<SnackbarProvider>
								<AppContent {...props} />
							</SnackbarProvider>
						</ApiProvider>
					</StoreProvider>
				</HydrationBoundary>
			</RecaptchaProvider>
		</QueryProvider>
	</ThemeProvider>
);

export default App;
