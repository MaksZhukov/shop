import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import type { CollectionParams } from 'shared/api/types';
import { ARTICLE_API, ArticleApi } from './article.api';
import type { Article } from './model/article.model';
import type { ArticleReader } from './ports/article.port';

const mapArticle = (article: Article): Article => ({ ...article });

@injectable()
export class ArticleService implements ArticleReader {
	constructor(@inject(ARTICLE_API) private readonly articleApi: ArticleApi) {}

	async fetchArticles(params: CollectionParams) {
		const { data } = await this.articleApi.fetchArticles(params);
		return { ...data, data: data.data.map(mapArticle) };
	}

	async fetchArticle(slug: string, params: { populate: string[] }) {
		const { data } = await this.articleApi.fetchArticle(slug, params);
		return mapArticle(data.data);
	}
}
