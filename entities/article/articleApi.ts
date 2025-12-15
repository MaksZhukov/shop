import { api } from 'shared/api';
import { ApiResponse, CollectionParams } from 'shared/api/types';
import { Article } from './articleTypes';

export const articlesApi = {
	fetchArticles: (params: CollectionParams) =>
		api.get<ApiResponse<Article[]>>('/articles', {
			params
		}),
	fetchArticle: (slug: string, params: { populate: string[] }) =>
		api.get<ApiResponse<Article>>(`/articles/${slug}`, { params })
};
