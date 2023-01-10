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
				<Script id='show-tawkto' strategy='lazyOnload'>
					{`var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
						(function(){
						var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
						s1.async=true;
						s1.src='https://embed.tawk.to/${publicRuntimeConfig.tawkPropertyId}/${publicRuntimeConfig.tawkId}';
						s1.charset='UTF-8';
						s1.setAttribute('crossorigin','*');
						s0.parentNode.insertBefore(s1,s0);
						})();`}
				</Script>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
