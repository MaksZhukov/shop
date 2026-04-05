import { articlesApi } from 'entities/article';
import type { Article } from 'entities/article';
import { pageApi, DefaultPage } from 'entities/page';
import type { ApiResponse } from 'shared/api/types';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { ArticlesHeader, ArticlesGrid, ArticlesPagination, useArticlesData } from 'features/articlesList';
import { LIMIT, DEFAULT_SORT } from 'features/articlesList';

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

export const getServerSideProps = getPageProps(pageApi.fetchPage('article'), async (context) => {
	const page = context.query?.page ? +context.query.page : 1;
	const start = (page - 1) * LIMIT;
	const sort = context.query?.sort ? context.query.sort : DEFAULT_SORT;

	return {
		props: {
			articles: (
				await articlesApi.fetchArticles({
					pagination: {
						start,
						limit: LIMIT
					},
					sort,
					populate: 'mainImage'
				})
			).data,
			serverQueryPage: context.query.page ? context.query.page : '1',
			breadcrumbs: [
				{ text: 'Главная', href: '/' },
				{ text: 'Статьи', href: '/articles' }
			]
		}
	};
});
