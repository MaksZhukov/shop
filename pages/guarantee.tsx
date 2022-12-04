import { Typography } from '@mui/material';
import { Container } from '@mui/system';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import HeadSEO from 'components/HeadSEO';
import ReactMarkdown from 'components/ReactMarkdown';
import SEOBox from 'components/SEOBox';
import WhiteBox from 'components/WhiteBox';
import Head from 'next/head';
import { getPageProps } from 'services/PagePropsService';

interface Props {
	page: DefaultPage & { content: string };
}

const Guarantee = ({ page }: Props) => {
	return (
		<>
			<HeadSEO
				title={page.seo?.title || 'Гарантия'}
				description={page.seo?.description || 'Гарантия на товары'}
				keywords={
					page.seo?.keywords ||
					'гарантия, гарантия на запчасти, запчасти, гарантия на товары, условия гарантии'
				}
			></HeadSEO>
			<Container>
				<WhiteBox>
					<Typography component='h1' variant='h4' textAlign='center'>
						{page.seo?.h1 || 'Гарантия'}
					</Typography>
					<ReactMarkdown content={page.content}></ReactMarkdown>
				</WhiteBox>
				<SEOBox images={page.seo?.images} content={page.seo?.content}></SEOBox>
			</Container>
		</>
	);
};

export default Guarantee;

export const getStaticProps = getPageProps(fetchPage('guarantee'));
