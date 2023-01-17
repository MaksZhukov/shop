import getConfig from 'next/config';
import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';
const { publicRuntimeConfig } = getConfig();

export default function Document() {
	return (
		<Html lang='ru'>
			<Head>
				<link rel='preconnect' href='https://fonts.googleapis.com' />
				<link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='*' />
				<link
					href='https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap'
					rel='stylesheet'
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
