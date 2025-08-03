import { Box, Typography, useMediaQuery } from '@mui/material';
import { fetchArticle } from 'api/articles/articles';
import { Article as IArticle } from 'api/articles/types';
import BlockImages from 'components/BlockImages/BlockImages';
import Image from 'components/features/Image/Image';
import ReactMarkdown from 'components/ReactMarkdown/ReactMarkdown';

import { NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';

interface Props {
	page: IArticle;
}

const Article: NextPage<Props> = ({ page }) => {
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	return (
		<>
			<Box display='flex' flexDirection={{ xs: 'column', sm: 'row' }}>
				<Typography
					variant={'h4'}
					display={{ xs: 'block', sm: 'none' }}
					component='h1'
					marginBottom='0.5em'
					fontWeight='500'
				>
					{page.name}
				</Typography>
				<Box maxWidth={{ xs: 'initial', sm: 390 }} width='100%'>
					<Image
						title={page.mainImage?.caption}
						src={page.mainImage?.formats?.small.url || page.mainImage?.url}
						width={500}
						style={isMobile ? { height: '100%', width: '100%', objectFit: 'cover' } : {}}
						height={260}
						alt={page.mainImage?.alternativeText}
					></Image>
				</Box>
				<Box
					minWidth={250}
					sx={{
						marginLeft: { xs: '0', sm: '3em' },
						flex: 1,
						marginTop: { xs: '0.5em', md: 0 }
					}}
				>
					<Typography
						display={{ xs: 'none', sm: 'block' }}
						variant='h4'
						component='h1'
						marginBottom='0.5em'
						fontWeight='500'
					>
						{page.name}
					</Typography>
					<ReactMarkdown content={page.rightText}></ReactMarkdown>
				</Box>
			</Box>
			<BlockImages
				withSlider={isMobile}
				withoutOverlay={isMobile}
				images={page.images1}
				sx={{
					marginY: { xs: '1em', md: '3em' },
					paddingY: { xs: '1em', md: '3em' },
					flexDirection: { xs: 'column', sm: 'row' }
				}}
			></BlockImages>
			<ReactMarkdown content={page.content1}></ReactMarkdown>
			<BlockImages
				withSlider={isMobile}
				withoutOverlay={isMobile}
				images={page.images2}
				sx={{
					marginY: { xs: '1em', md: '3em' },
					paddingY: { xs: '1em', md: '3em' },
					flexDirection: { xs: 'column', sm: 'row' }
				}}
			></BlockImages>
			<ReactMarkdown content={page.content2}></ReactMarkdown>
		</>
	);
};

export default Article;

export const getServerSideProps = getPageProps(undefined, async (context) => ({
	page: (
		await fetchArticle(context.params?.slug as string, {
			populate: ['mainImage', 'images1', 'images2', 'seo']
		})
	).data.data
}));
