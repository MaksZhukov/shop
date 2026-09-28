import { Container } from '@mui/material';
import { Breadcrumbs } from 'shared/ui';
import { HeadSEO } from 'app';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ErrorInfo, useMemo } from 'react';
import { reatomComponent } from '@reatom/react';
import { useQuery } from '@tanstack/react-query';
import { SparePartService } from 'entities/sparePart';
import { inject, mainPageQueryFns, mainPageQueryKeys } from 'features/mainPage';
import { generateSparePartsFiltersByQuery, useSparePartsCatalogFiltersStore } from 'features/catalog';
import { Header, getHeaderSearchPlaceholder } from 'features/header';
import { Footer } from 'features/footer';
import { ModalAuth } from 'features/user';
import { useLogout } from 'features/user';
import { useClearFavorites, useLoadFavorites } from 'features/favorites';
import { useLoadCart } from 'features/cart';
import { WorkTimetable } from 'features/workTimetable';
import { ErrorBoundary } from 'react-error-boundary';
import { Layout } from 'shared/ui';
import { RouteShield } from 'features/routeShield';
import { DehydratedState, HydrationBoundary } from '@tanstack/react-query';
import { AppDiProvider } from 'app/providers';
import { QueryProvider } from 'app/providers/QueryProvider';
import { ThemeProvider } from 'app/providers/ThemeProvider';
import { SnackbarProvider } from 'app/providers/SnackbarProvider';
import { ApiProvider } from 'app/providers/ApiProvider';
import { useInitialAuthLoad } from 'app/hooks/useInitialAuthLoad';
import { ScrollUp } from 'features/scrollUp';
import { RecaptchaProvider } from 'app/providers/RecaptchaProvider';
import './app.scss';

const AppContent = reatomComponent(({ Component, pageProps }: AppProps) => {
	const router = useRouter();
	useInitialAuthLoad();
	const sparePartService = inject(SparePartService);
	const { filtersValues } = useSparePartsCatalogFiltersStore();
	const logout = useLogout();
	const clearFavorites = useClearFavorites();
	const loadFavorites = useLoadFavorites();
	const loadCart = useLoadCart();
	const { data: sparePartsTotal } = useQuery({
		queryKey: mainPageQueryKeys.sparePartsTotal(),
		queryFn: () => mainPageQueryFns.sparePartsTotal(sparePartService),
		select: (response) => response.meta?.pagination?.total
	});
	const searchPlaceholder = getHeaderSearchPlaceholder(sparePartsTotal);
	const catalogFilters = generateSparePartsFiltersByQuery(filtersValues);

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

	const handleRenderError = (error: unknown, info: ErrorInfo) => {
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
			<Header
				searchPlaceholder={searchPlaceholder}
				catalogFilters={catalogFilters}
				workTimetable={<WorkTimetable />}
				workTimetableCompact={<WorkTimetable compact />}
				logout={logout}
				clearFavorites={clearFavorites}
				loadFavorites={loadFavorites}
				onLoginSuccess={async () => {
					await Promise.all([loadCart(), loadFavorites()]);
				}}
				renderAuthModal={(props) => (
					<ModalAuth
						isResetPassword={props.isResetPassword}
						onChangeModalOpened={props.onChangeModalOpened}
						onLoginSuccess={async () => {
							await props.onLoginSuccess();
						}}
					/>
				)}
			/>
			<RouteShield>
				<ErrorBoundary fallback={<></>} onError={handleRenderError}>
					<Breadcrumbs breadcrumbs={pageProps.breadcrumbs || []}></Breadcrumbs>
					<Container sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
						<Component {...pageProps} />
					</Container>
				</ErrorBoundary>
			</RouteShield>
			<Footer
				loadCart={loadCart}
				loadFavorites={loadFavorites}
				renderAuthModal={(props) => (
					<ModalAuth
						isResetPassword={false}
						onChangeModalOpened={props.onChangeModalOpened}
						onLoginSuccess={async () => {
							await props.onLoginSuccess();
						}}
					/>
				)}
			/>
			<ScrollUp />
		</Layout>
	);
});

const App = (props: AppProps<{ dehydratedState: DehydratedState }>) => (
	<ThemeProvider>
		<AppDiProvider>
			<QueryProvider>
				<RecaptchaProvider>
					<HydrationBoundary state={props.pageProps?.dehydratedState}>
						<ApiProvider>
							<SnackbarProvider>
								<AppContent {...props} />
							</SnackbarProvider>
						</ApiProvider>
					</HydrationBoundary>
				</RecaptchaProvider>
			</QueryProvider>
		</AppDiProvider>
	</ThemeProvider>
);

export default App;
