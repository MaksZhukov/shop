import { roboto } from 'fonts';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang='ru'>
            <Head>
                <link rel='apple-touch-icon' href='/favicons/apple-touch-icon.png' />
                <link rel='icon' type='image/png' sizes='96x96' href='/favicons/favicon-16x16.png' />
                <link rel='icon' type='image/png' sizes='32x32' href='/favicons/favicon-32x32.png' />
                <link rel='manifest' href='/favicons/site.webmanifest' />
                <script async type='text/javascript' src='https://js.bepaid.by/widget/be_gateway.js'></script>
            </Head>
            <body className={roboto.className}>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
