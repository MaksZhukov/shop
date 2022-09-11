import { api } from '..';
import { ApiResponse, CollectionParams } from 'api/types';
import { Article } from './types';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const getArticles = (params: CollectionParams) =>
	api.get<ApiResponse<Article[]>>('/articles', { params });

export const fetchArticle = (idOrSlug: string, isServerRequest = false) =>
	api.get<ApiResponse<Article>>(`/articles/${idOrSlug}`, {
		...(isServerRequest
			? { baseURL: publicRuntimeConfig.backendLocalUrl + '/api' }
			: {}),
	});
