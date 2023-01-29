import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'mobx-react';
import { store } from '../store';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Content from '../components/Content';
import Layout from '../components/Layout';
import { Box, Button, createTheme, Link, ThemeProvider } from '@mui/material';
import { green } from '@mui/material/colors';
import { UIEventHandler, useEffect, useState } from 'react';
import { getJwt, saveJwt } from '../services/LocalStorageService';
import RouteShield from '../components/RouteShield/RouteShield';
import NotistackService from 'services/NotistackService';
import { fetchBrands } from 'api/brands/brands';
import { MAX_LIMIT } from 'api/constants';
import { Brand } from 'api/brands/types';
import Breadcrumbs from 'components/Breadcrumbs';
import HeadSEO from 'components/HeadSEO';
import { Container } from '@mui/system';
import SEOBox from 'components/SEOBox';
import Metrics from 'components/Metrics';
import { ApiResponse } from 'api/types';
import { useThrottle } from 'rooks';
import { OFFSET_SCROLL_LOAD_MORE } from '../constants';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './app.scss';

let theme = createTheme({
    typography: {
        fontFamily: 'Roboto'
    },
    palette: {
        primary: {
            ...green,
            contrastText: '#fff'
        }
    }
});

function MyApp({
    Component,
    pageProps: {
        layout: { footer },
        ...restPageProps
    }
}: AppProps) {
    const [brands, setBrands] = useState<ApiResponse<Brand[]>>(restPageProps.brands ?? { data: [] });
    const [throttledLoadMoreBrands] = useThrottle(async () => {
        await handleLoadMoreBrands();
    });

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
        const fetchBrandsData = async () => {
            if (!brands.data.length) {
                const { data } = await fetchBrands({
                    pagination: { limit: MAX_LIMIT },
                    populate: ['image', 'seo.images']
                });
                setBrands(data);
            }
        };
        tryFetchData();
        fetchBrandsData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLoadMoreBrands = async () => {
        if (brands.meta.pagination?.total && brands.data.length < brands.meta.pagination.total) {
            const { data } = await fetchBrands({
                populate: 'image',
                pagination: { start: brands.data.length }
            });
            setBrands({ data: [...brands.data, ...data.data], meta: data.meta });
        }
    };

    const handleScrollBrandsList: UIEventHandler<HTMLUListElement> = (event) => {
        if (
            event.currentTarget.scrollTop + event.currentTarget.offsetHeight + OFFSET_SCROLL_LOAD_MORE >=
            event.currentTarget.scrollHeight
        ) {
            throttledLoadMoreBrands();
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
                    maxSnack={3}>
                    <Layout>
                        {process.env.NODE_ENV === 'production' && <Metrics></Metrics>}
                        <HeadSEO
                            title={restPageProps.page?.seo?.title}
                            description={restPageProps.page?.seo?.description}
                            keywords={restPageProps.page?.seo?.keywords}></HeadSEO>
                        <Header onScrollBrandsList={handleScrollBrandsList} brands={brands}></Header>
                        <RouteShield>
                            <Content>
                                <Container>
                                    {/* <Breadcrumbs h1={restPageProps.data?.h1 || restPageProps.page?.name}></Breadcrumbs> */}
                                    <Component
                                        {...restPageProps}
                                        brands={brands}
                                        loadMoreBrands={handleLoadMoreBrands}
                                        onScrollBrandsList={handleScrollBrandsList}
                                    />
                                    <SEOBox
                                        images={restPageProps.page?.seo?.images}
                                        content={restPageProps.page?.seo?.content}></SEOBox>
                                </Container>
                            </Content>
                        </RouteShield>
                        <Footer footer={footer}></Footer>
                        <Box bottom={0} right={0} position="fixed">
                            <Button variant="contained" component="a" href="tel:+375297804780">
                                Заказать
                            </Button>
                        </Box>
                    </Layout>
                </SnackbarProvider>
            </Provider>
        </ThemeProvider>
    );
}

export default MyApp;
