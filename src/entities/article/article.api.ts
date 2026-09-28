import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { ArticleDto } from './dto/article.dto';

export const ARTICLE_API = Symbol('ArticleApi');

@injectable()
export class ArticleApi {
	fetchArticles(params: CollectionParams) {
		return api.get<ApiResponse<ArticleDto[]>>('/articles', {
			params
		});
	}

	fetchArticle(slug: string, params: { populate: string[] }) {
		return api.get<ApiResponse<ArticleDto>>(`/articles/${slug}`, { params });
	}
}
