import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { Article } from '../model/article.model';

export interface ArticleReader {
	fetchArticles(params: CollectionParams): Promise<ApiResponse<Article[]>>;
	fetchArticle(slug: string, params: { populate: string[] }): Promise<Article>;
}
