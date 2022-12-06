import { Box, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { fetchArtcle } from 'api/articles/articles';
import { Article as IArticle } from 'api/articles/types';
import HeadSEO from 'components/HeadSEO';
import Image from 'components/Image';
import ReactMarkdown from 'components/ReactMarkdown';
import SEOBox from 'components/SEOBox';
import WhiteBox from 'components/WhiteBox';
import { GetServerSideProps, NextPage } from 'next';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

interface Props {
	data: IArticle;
}

const Article: NextPage<Props> = ({ data }) => {
	return (
		<>
			<HeadSEO title={data.seo?.title} description={data.seo?.content} keywords={data.seo?.keywords}></HeadSEO>
			<Container>
				<WhiteBox>
					<Typography component='h1' variant='h4' gutterBottom>
						{data.name}
					</Typography>
					<Typography variant='body1' color='text.secondary' gutterBottom>
						Категория: {data.type}
					</Typography>
					<Typography variant='body1' color='text.secondary' gutterBottom>
						Дата публиации: {new Date(data.createdAt).toLocaleDateString('ru-RU')}{' '}
						{new Date(data.createdAt).toLocaleTimeString('ru-RU', {
							hour: '2-digit',
							minute: '2-digit',
						})}
					</Typography>
					<Box>
						<Box marginRight='1em' sx={{ float: 'left' }}>
							<Image
								alt={data.image.alternativeText}
								width={640}
								height={480}
								src={data.image?.url}
							></Image>
						</Box>
						<ReactMarkdown content={data.description}></ReactMarkdown>
						<Box sx={{ clear: 'both' }}></Box>
					</Box>
				</WhiteBox>
				<SEOBox content={data.seo?.content} images={data.seo?.images}></SEOBox>
			</Container>
		</>
	);
};

export default Article;

export const getServerSideProps: GetServerSideProps<{}, { slug: string }> = async (context) => {
	let data = null;
	let notFound = false;
	try {
		const result = await fetchArtcle(context.params?.slug as string, true);
		data = result.data.data;
	} catch (err) {
		notFound = true;
	}
	return { props: { data }, notFound };
};
