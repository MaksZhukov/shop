import { fetchArticles } from 'api/articles/articles';
import { Article } from 'api/articles/types';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import { ApiResponse } from 'api/types';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { getPageProps } from 'services/PagePropsService';
import { ArticlesHeader, ArticlesGrid, ArticlesPagination, useArticlesData } from 'components/features/pages/articles';
import { LIMIT, DEFAULT_SORT } from 'components/features/pages/articles/constants';

interface Props {
	page: DefaultPage;
	articles: ApiResponse<Article[]>;
	serverQueryPage: string;
}

const Articles: NextPage<Props> = ({ page, articles, serverQueryPage }) => {
	const router = useRouter();

	const qPage = (router.query.page as string) || '1';
	const qSort = (router.query.sort as string) || DEFAULT_SORT;

	const { data: articlesData, isFetching } = useArticlesData(qPage, qSort, serverQueryPage, articles);

	const total = articles?.meta?.pagination?.total ?? 0;
	const pageCount = Math.ceil(total / LIMIT);

	const handleSortChange = (newSort: string) => {
		router.push({
			query: {
				...router.query,
				sort: newSort,
				page: '1'
			}
		});
	};

	return (
		<>
			<ArticlesHeader currentSort={qSort} onSortChange={handleSortChange} />
			<ArticlesGrid articles={articlesData} isLoading={isFetching} />
			<ArticlesPagination currentPage={+qPage} totalPages={pageCount} />
		</>
	);
};

export default Articles;

export const getServerSideProps = getPageProps(fetchPage('article'), async (context) => {
	const page = context.query?.page ? +context.query.page : 1;
	const start = (page - 1) * LIMIT;
	const sort = context.query?.sort ? context.query.sort : DEFAULT_SORT;

	return {
		props: {
			articles: (
				await fetchArticles({
					pagination: {
						start,
						limit: LIMIT
					},
					sort,
					populate: 'mainImage'
				})
			).data,
			serverQueryPage: context.query.page ? context.query.page : '1'
		}
	};
});
