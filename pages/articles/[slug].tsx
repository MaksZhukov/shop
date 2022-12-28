import { Box, Typography, useMediaQuery } from '@mui/material';
import { Container } from '@mui/system';
import { fetchArtcle } from 'api/articles/articles';
import { Article as IArticle } from 'api/articles/types';
import HeadSEO from 'components/HeadSEO';
import Image from 'components/Image';
import ReactMarkdown from 'components/ReactMarkdown';
import SEOBox from 'components/SEOBox';
import WhiteBox from 'components/WhiteBox';
import { GetServerSideProps, NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';

interface Props {
	data: IArticle;
}

const Article: NextPage<Props> = ({ data }) => {
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	return (
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
				<Box
					sx={{
						marginRight: { xs: 0, sm: '1em' },
						marginBottom: { xs: '1em', sm: 0 },
						float: 'left',
					}}
				>
					<Image
						alt={data.image?.alternativeText}
						width={isMobile ? 500 : 640}
						height={isMobile ? 375 : 480}
						src={isMobile ? data.image?.formats?.small.url || '' : data.image?.url || ''}
						style={{ height: 'auto' }}
					></Image>
				</Box>
				<ReactMarkdown content={data.description}></ReactMarkdown>
				<Box sx={{ clear: 'both' }}></Box>
			</Box>
		</WhiteBox>
	);
};

export default Article;

export const getServerSideProps = getPageProps(undefined, async (context) => ({
	data: (await fetchArtcle(context.params?.slug as string)).data.data,
}));
