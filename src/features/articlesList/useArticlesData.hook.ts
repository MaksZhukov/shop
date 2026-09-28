import { useQuery } from '@tanstack/react-query';
import { type Article } from 'entities/article';
import type { ApiResponse } from 'shared/api/types';
import { useDI } from './articlesList.di';
import { LIMIT } from './articlesList.constants';

export const useArticlesData = (
	page: string,
	sort: string,
	serverQueryPage: string,
	initialArticles?: ApiResponse<Article[]>
) => {
	const { articleReader } = useDI();
	return useQuery({
		queryKey: ['articles', page, sort],
		placeholderData: (prev) => prev,
		queryFn: async () => {
			const { data } = await articleReader.fetchArticles({
				pagination: {
					start: page === '1' ? 0 : (+page - 1) * LIMIT,
					limit: LIMIT
				},
				sort,
				populate: 'mainImage'
			});
			return data;
		},
		initialData: serverQueryPage === page ? initialArticles?.data : undefined,
		enabled: serverQueryPage !== page
	});
};
