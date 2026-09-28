import { createRequestContainer } from 'app/di/app.container';
import { ArticleService, type Article } from 'entities/article';
import { pageApi, DefaultPage } from 'entities/page';
import type { ApiResponse } from 'shared/api/types';
import { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import {
	ArticlesList,
	ArticlesListContext,
	inject,
	LIMIT,
	DEFAULT_SORT
} from 'features/articlesList';

interface Props {
	page: DefaultPage;
	articles: ApiResponse<Article[]>;
	serverQueryPage: string;
}

const Articles: NextPage<Props> = ({ articles, serverQueryPage }) => {
	const articleReader = inject(ArticleService);

	return (
		<ArticlesListContext.Provider value={{ articleReader }}>
			<ArticlesList articles={articles} serverQueryPage={serverQueryPage} />
		</ArticlesListContext.Provider>
	);
};

export default Articles;

export const getServerSideProps = getPageProps(pageApi.fetchPage('article'), async (context) => {
	const container = createRequestContainer();
	const articleReader = container.get(ArticleService);
	const page = context.query?.page ? +context.query.page : 1;
	const start = (page - 1) * LIMIT;
	const sort = context.query?.sort ? context.query.sort : DEFAULT_SORT;

	return {
		props: {
			articles: await articleReader.fetchArticles({
				pagination: {
					start,
					limit: LIMIT
				},
				sort,
				populate: 'mainImage'
			}),
			serverQueryPage: context.query.page ? context.query.page : '1',
			breadcrumbs: [
				{ text: 'Главная', href: '/' },
				{ text: 'Статьи', href: '/articles' }
			]
		}
	};
});
