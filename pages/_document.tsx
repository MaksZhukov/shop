import getConfig from 'next/config';
import { Html, Head, Main, NextScript } from 'next/document';

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
				<link rel='apple-touch-icon' href='favicons/apple-touch-icon.png' />
				<link rel='icon' type='image/png' sizes='96x96' href='favicons/favicon-16x16.png' />
				<link rel='icon' type='image/png' sizes='32x32' href='favicons/favicon-32x32.png' />
				<link rel='manifest' href='favicons/site.webmanifest.json' />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
