import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import { ArticleNew } from './types';

export const fetchArticlesNew = (params: CollectionParams) =>
	api.get<ApiResponse<ArticleNew[]>>('/new-articles', {
		params,
	});

export const fetchArticleNew = (slug: string, params: { populate: string[] }) =>
	api.get<ApiResponse<ArticleNew>>(`/new-articles/${slug}`, { params });
