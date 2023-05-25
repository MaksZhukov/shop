import { Box, Pagination, PaginationItem } from '@mui/material';
import { fetchArticlesNew } from 'api/articlesNew/articlesNew';
import { ArticleNew } from 'api/articlesNew/types';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import { ApiResponse } from 'api/types';
import CardItem from 'components/CardItem';
import Typography from 'components/Typography';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getPageProps } from 'services/PagePropsService';

const LIMIT = 10;

interface Props {
	page: DefaultPage;
	articles: ApiResponse<ArticleNew[]>;
}

const Articles: NextPage<Props> = ({ page, articles }) => {
	const [data, setData] = useState<ArticleNew[]>(articles ? articles.data : []);
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const total = articles?.meta?.pagination?.total ?? 0;
	const pageCount = Math.ceil(total / LIMIT);
	const router = useRouter();

	const { page: qPage = '1' } = router.query as {
		page: string;
	};

	useEffect(() => {
		if (isMounted) {
			const fetchData = async () => {
				const {
					data: { data },
				} = await fetchArticlesNew({
					pagination: {
						start: qPage === '1' ? 0 : (+qPage - 1) * LIMIT,
						limit: LIMIT,
					},
					populate: 'image',
				});
				setData(data);
			};
			fetchData();
		}
		setIsMounted(true);
	}, [qPage]);

	return (
		<>
			<Box sx={{ typography: { xs: 'h5', md: 'h4' } }}>
				<Typography
					withSeparator
					textTransform='uppercase'
					component='h1'
					marginBottom='1em'
					fontSize='inherit'
				>
					{page.seo?.h1 || 'Статьи'}
				</Typography>
			</Box>
			{data.map((item) => (
				<CardItem
					key={item.id}
					description={item.rightText}
					name={item.name}
					image={item.mainImage}
					link={`/articles-new/${item.slug}`}
				></CardItem>
			))}
			{pageCount > 1 && (
				<Box display='flex' justifyContent='center'>
					<Pagination
						page={+qPage}
						renderItem={(params) =>
							params.disabled ? (
								<PaginationItem {...params} />
							) : (
								<NextLink shallow href={`${router.pathname}?page=${params.page}`}>
									<PaginationItem {...params} />
								</NextLink>
							)
						}
						siblingCount={2}
						color='primary'
						count={pageCount}
						variant='outlined'
					/>
				</Box>
			)}
		</>
	);
};

export default Articles;

export const getServerSideProps = getPageProps(fetchPage('article'), async (context) => {
	const start = !context.query?.page || context.query?.page === '1' ? 0 : +context.query.page * LIMIT;
	return {
		articles: (
			await fetchArticlesNew({
				pagination: {
					start,
					limit: LIMIT,
				},
				populate: 'image',
			})
		).data,
	};
});
