import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'mobx-react';
import Store from '../store';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Content from '../components/Content';
import Layout from '../components/Layout';

const store = new Store();

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Provider {...store}>
            <Layout>
                <Header></Header>
                <Content>
                    <Component {...pageProps} />
                </Content>
                <Footer></Footer>
            </Layout>
        </Provider>
    );
}

export default MyApp;
