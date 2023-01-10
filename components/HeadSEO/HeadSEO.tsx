import Head from 'next/head';
import { useRouter } from 'next/router';
import { FC } from 'react';

interface Props {
	title?: string;
	description?: string;
	keywords?: string;
}

const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

const HeadSEO: FC<Props> = ({ title, description, keywords }) => {
	const router = useRouter();
	return (
		<Head>
			<title>{title}</title>
			<meta name='description' content={description}></meta>
			<meta name='keywords' content={keywords} />
			<meta property='og:url' content={origin + router.asPath} />
			<meta property='og:site_name' content='Разбор авто' />
			<meta property='og:title' content={title} />
			<meta property='og:description' content={description} />
			<meta property='twitter:title' content={title} />
			<meta property='twitter:description' content={description} />
		</Head>
	);
};

export default HeadSEO;
