import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'mobx-react';
import { store } from '../store';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Content from '../components/Content';
import Layout from '../components/Layout';
import { createTheme, Snackbar, Stack, ThemeProvider } from '@mui/material';
import { green, lightGreen, lime, red } from '@mui/material/colors';
import { useEffect } from 'react';
import { getJwt, saveJwt } from '../services/LocalStorageService';
import Notification from '../components/Notification';
import RouteShield from '../components/RouteShield/RouteShield';

let theme = createTheme({
    palette: {
        primary: {
            ...green,
            contrastText: '#fff'
        }
    }
});

function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        const tryFetchData = async () => {
            let token = getJwt();
            if (token) {
                store.user.setJWT(token);
                try {
                    await Promise.all([
                        store.user.getInfo(),
                        store.cart.getShoppingCart(),
                        store.favorites.getFavorites()
                    ]);
                } catch (err) {
                    saveJwt('');
                }
            }
            store.setIsInitialRequestDone();
        };
        tryFetchData();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <Layout>
                    <Header></Header>
                    <Content>
                        <RouteShield>
                            <Component {...pageProps} />
                        </RouteShield>
                    </Content>
                    <Footer></Footer>
                    <Notification></Notification>
                </Layout>
            </Provider>
        </ThemeProvider>
    );
}

export default MyApp;
