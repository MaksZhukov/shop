import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import { Article } from './types';

export const fetchArticles = (params: CollectionParams) =>
    api.get<ApiResponse<Article[]>>('/new-articles', {
        params
    });

export const fetchArticle = (slug: string, params: { populate: string[] }) =>
    api.get<ApiResponse<Article>>(`/new-articles/${slug}`, { params });
