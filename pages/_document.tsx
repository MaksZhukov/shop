import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html>
			<Head>
				<link
					rel='stylesheet preload'
					href='https://cdnjs.cloudflare.com/ajax/libs/lato-font/3.0.0/css/lato-font.min.css'
					as='style'
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
