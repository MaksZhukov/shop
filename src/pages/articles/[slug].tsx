import { Box, Link, Typography, useMediaQuery } from '@mui/material';
import { articlesApi } from 'entities/article';
import { Article as IArticle } from 'entities/article/articleTypes';
import { Image } from 'shared/ui';
import { ReactMarkdown } from 'shared/ui';
import { SocialButtons } from 'shared/ui';
import { SOCIAL_TELEGRAM } from 'shared/ui';
import { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';

interface Props {
	page: IArticle;
}

const Article: NextPage<Props> = ({ page }) => {
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	return (
		<>
			<Typography mb={2} variant='h6'>
				{page.name}
			</Typography>
			<Box mb={2} maxWidth={880}>
				<Box mb={1}>
					<Image
						title={page.mainImage?.caption}
						src={isMobile ? page.mainImage?.formats?.small.url : page.mainImage?.formats?.large.url}
						width={isMobile ? 400 : 880}
						style={{ objectFit: 'cover', width: '100%' }}
						height={isMobile ? 300 : 704}
						alt={page.mainImage?.alternativeText}
					></Image>
				</Box>
				<ReactMarkdown content={page.rightText}></ReactMarkdown>
				<ReactMarkdown content={page.content1}></ReactMarkdown>
				<ReactMarkdown content={page.content2}></ReactMarkdown>
			</Box>
			<Typography mb={2} fontSize={16} sx={{ color: 'custom.black' }} fontWeight={500}>
				Подписывайтесь на наши новости в 
				<Link sx={{ textDecoration: 'underline', color: 'custom.black' }} href={SOCIAL_TELEGRAM.href}>
					{SOCIAL_TELEGRAM.name}
				</Link>
			</Typography>
			<SocialButtons sx={{ mb: 6 }} />
		</>
	);
};

export default Article;

export const getServerSideProps = getPageProps(undefined, async (context) => {
	const article = (
		await articlesApi.fetchArticle(context.params?.slug as string, {
			populate: ['mainImage', 'images1', 'images2', 'seo']
		})
	).data.data;
	const content = article.content || article.rightText + article.content1 + article.content2;
	const page = { ...article, content };

	return {
		props: {
			page,
			breadcrumbs: [
				{ text: 'Главная', href: '/' },
				{ text: 'Статьи', href: '/articles' },
				{ text: article.name, href: `/articles/${article.slug}` }
			]
		}
	};
});
