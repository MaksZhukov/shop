import { useRouter } from 'next/router';
import { type Article } from 'entities/article';
import type { ApiResponse } from 'shared/api/types';
import { DEFAULT_SORT, LIMIT } from '../articlesList.constants';
import { useArticlesData } from '../useArticlesData.hook';
import { ArticlesGrid } from './articlesGrid.component';
import { ArticlesHeader } from './articlesHeader.component';
import { ArticlesPagination } from './articlesPagination.component';

type ArticlesListProps = {
	articles: ApiResponse<Article[]>;
	serverQueryPage: string;
};

export const ArticlesList = ({ articles, serverQueryPage }: ArticlesListProps) => {
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
