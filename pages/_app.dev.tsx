import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'mobx-react';
import { store } from '../store';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Content from '../components/Content';
import Layout from '../components/Layout';
import { Box, Button, createTheme, IconButton, Link, ThemeProvider } from '@mui/material';
import { useEffect, useState } from 'react';
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
import { OFFSET_SCROLL_LOAD_MORE } from '../constants';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './app.scss';
import { LocalPhone } from '@mui/icons-material';

let theme = createTheme({
    typography: {
        fontFamily: 'Roboto'
    },
    palette: {
        primary: {
            main: '#fdb819',
            contrastText: '#fff'
        },
        secondary: {
            main: '#0C1555'
        }
    }
});

function MyApp({
    Component,
    pageProps: {
        hasGlobalContainer = true,
        layout: { footer },
        ...restPageProps
    }
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
            if (!brands.length) {
                const {
                    data: { data }
                } = await fetchBrands({
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

    const renderContent = (
        <>
            <Breadcrumbs
                exclude={['buyback-cars']}
                h1={restPageProps.data?.h1 || restPageProps.page?.name}></Breadcrumbs>
            <Component {...restPageProps} brands={brands} />
            {!hasGlobalContainer ? (
                <Container>
                    <SEOBox
                        images={restPageProps.page?.seo?.images}
                        content={restPageProps.page?.seo?.content}></SEOBox>
                </Container>
            ) : (
                <SEOBox images={restPageProps.page?.seo?.images} content={restPageProps.page?.seo?.content}></SEOBox>
            )}
        </>
    );

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
                        <Header brands={brands}></Header>
                        <RouteShield>
                            <Content>
                                {hasGlobalContainer ? <Container>{renderContent}</Container> : renderContent}
                            </Content>
                        </RouteShield>
                        <Footer footer={footer}></Footer>
                        <Box bottom={10} right={10} position="fixed">
                            <Button
                                sx={{ minWidth: '50px', height: '50px', borderRadius: ' 50%', padding: '0' }}
                                variant="contained"
                                component="a"
                                href="tel:+375297804780">
                                <LocalPhone></LocalPhone>
                            </Button>
                        </Box>
                    </Layout>
                </SnackbarProvider>
            </Provider>
        </ThemeProvider>
    );
}

export default MyApp;
