import { useQuery } from '@tanstack/react-query';
import { fetchArticles } from 'api/articles/articles';
import { Article } from 'api/articles/types';
import { ApiResponse } from 'api/types';
import { LIMIT } from '../constants';

export const useArticlesData = (
	page: string,
	sort: string,
	serverQueryPage: string,
	initialArticles?: ApiResponse<Article[]>
) => {
	return useQuery({
		queryKey: ['articles', page, sort],
		placeholderData: (prev) => prev,
		queryFn: async () => {
			const {
				data: { data }
			} = await fetchArticles({
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
