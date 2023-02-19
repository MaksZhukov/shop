import { Box, Button, createTheme, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';
import NextApp from 'next/app';
import { Container } from '@mui/system';
import { Provider } from 'mobx-react';
import { store } from '../store';
import parser from 'ua-parser-js';
import mediaQuery from 'css-mediaquery';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Content from '../components/Content';
import Layout from '../components/Layout';
import { useEffect, useMemo } from 'react';
import { getJwt, saveJwt } from '../services/LocalStorageService';
import RouteShield from '../components/RouteShield/RouteShield';
import NotistackService from 'services/NotistackService';
import Breadcrumbs from 'components/Breadcrumbs';
import HeadSEO from 'components/HeadSEO';
import SEOBox from 'components/SEOBox';
import Metrics from 'components/Metrics';
import { LocalPhone } from '@mui/icons-material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './app.scss';
import { roboto } from 'fonts';

function MyApp({
    Component,
    pageProps: { hasGlobalContainer = true, hideSEOBox = false, layout, ...restPageProps },
    deviceType
}: AppProps & { deviceType: 'desktop' | 'mobile' }) {
    let theme = useMemo(
        () =>
            createTheme({
                typography: {
                    fontFamily: roboto.style.fontFamily
                },
                palette: {
                    primary: {
                        main: '#fdb819',
                        contrastText: '#fff'
                    },
                    secondary: {
                        main: '#0C1555'
                    }
                },
                components: {
                    MuiUseMediaQuery: {
                        defaultProps: {
                            ssrMatchMedia: (query) => ({
                                matches: mediaQuery.match(query, {
                                    width: deviceType === 'mobile' ? '0px' : '1024px'
                                })
                            })
                        }
                    }
                }
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
            <Component {...restPageProps} />
            {!hideSEOBox && (
                <>
                    {!hasGlobalContainer ? (
                        <Container>
                            <SEOBox
                                images={restPageProps.page?.seo?.images}
                                content={restPageProps.page?.seo?.content}></SEOBox>
                        </Container>
                    ) : (
                        <SEOBox
                            images={restPageProps.page?.seo?.images}
                            content={restPageProps.page?.seo?.content}></SEOBox>
                    )}
                </>
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
                        <Header brands={restPageProps.brands}></Header>
                        <RouteShield>
                            <Content>
                                <Breadcrumbs
                                    exclude={['buyback-cars']}
                                    h1={restPageProps.data?.h1 || restPageProps.page?.name}></Breadcrumbs>
                                {hasGlobalContainer ? <Container>{renderContent}</Container> : renderContent}
                            </Content>
                        </RouteShield>
                        <Footer footer={layout.footer}></Footer>
                        <Box bottom={10} right={10} zIndex={10} position="fixed">
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

// MyApp.getInitialProps = (context: any) => ({
//     ...NextApp.getInitialProps(context),
//     deviceType: context.ctx.req ? parser(context.ctx.req.headers['user-agent']).device.type || 'desktop' : 'desktop'
// });

export default MyApp;
