import { ARTICLE_API, ArticleApi, ArticleService } from 'entities/article';

export const appTokens = [ARTICLE_API, ArticleService] as const;

export const appContainer = { getKeys: () => appTokens };

export type AppBindings = { [ARTICLE_API]: ArticleApi };
