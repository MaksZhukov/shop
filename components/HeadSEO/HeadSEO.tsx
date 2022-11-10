import Head from 'next/head';
import { FC } from 'react';

interface Props {
	title: string;
	description: string;
	keywords: string;
}

const HeadSEO: FC<Props> = ({ title, description, keywords }) => {
	return (
		<Head>
			<title>{title}</title>{' '}
			<meta name='description' content={description}></meta>
			<meta name='keywords' content={keywords} />
		</Head>
	);
};

export default HeadSEO;
