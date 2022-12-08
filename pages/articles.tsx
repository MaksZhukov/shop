import { Box, Pagination, Typography } from '@mui/material';
import { fetchArticles } from 'api/articles/articles';
import { Article, Article as IArticle } from 'api/articles/types';
import { ApiResponse } from 'api/types';
import WhiteBox from 'components/WhiteBox';
import { NextPage } from 'next';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getPageProps } from 'services/PagePropsService';
import Card from 'components/Card';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';

const { publicRuntimeConfig } = getConfig();

const LIMIT = 10;

interface Props {
	page: DefaultPage;
	articles: ApiResponse<Article[]>;
}

const Articles: NextPage<Props> = ({ page, articles }) => {
	const [data, setData] = useState<Article[]>(articles.data);
	const pageCount = articles.meta.pagination?.pageCount ?? 0;
	const router = useRouter();

	const { page: qPage = '1' } = router.query as {
		page: string;
	};

	const handleChangePage = async (_: any, newPage: number) => {
		router.query.page = newPage.toString();
		router.push({ pathname: router.pathname, query: router.query }, undefined, {
			shallow: true,
		});
		const {
			data: { data },
		} = await fetchArticles({
			pagination: { page: +newPage, pageSize: LIMIT },
			populate: 'image',
		});
		setData(data);
	};
	return (
		<WhiteBox>
			<Typography textAlign='center' component='h1' variant='h4' marginBottom='1em'>
				{page.seo?.h1 || 'Статьи'}
			</Typography>
			{data.map((item) => (
				<Card
					key={item.id}
					description={item.description}
					name={item.name}
					image={item.image}
					link={`/articles/${item.slug}`}
				></Card>
			))}
			{pageCount > 1 && (
				<Box display='flex' justifyContent='center'>
					<Pagination
						page={+qPage}
						siblingCount={2}
						color='primary'
						count={pageCount}
						onChange={handleChangePage}
						variant='outlined'
					/>
				</Box>
			)}
		</WhiteBox>
	);
};

export default Articles;

export const getServerSideProps = getPageProps(fetchPage('article'), async (context) => ({
	articles: (
		await fetchArticles(
			{
				pagination: {
					pageSize: LIMIT,
					page: context.query?.page ?? 1,
				},
				populate: 'image',
			},
			true
		)
	).data,
}));
