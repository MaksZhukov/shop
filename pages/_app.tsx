import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'mobx-react';
import { store } from '../store';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Content from '../components/Content';
import Layout from '../components/Layout';
import { createTheme, ThemeProvider } from '@mui/material';
import { green, lightGreen, lime, red } from '@mui/material/colors';
import { useEffect } from 'react';
import { getJwt } from '../services/LocalStorageService';

let theme = createTheme({
    palette: {
        primary: lightGreen,
        secondary: red,
    },
});

function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        let token = getJwt();
        if (token) {
            store.user.getInfo();
        }
    }, []);
    return (
        <ThemeProvider theme={theme}>
            <Provider {...store}>
                <Layout>
                    <Header></Header>
                    <Content>
                        <Component {...pageProps} />
                    </Content>
                    <Footer></Footer>
                </Layout>
            </Provider>
        </ThemeProvider>
    );
}

export default MyApp;
