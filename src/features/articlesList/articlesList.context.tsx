import { createContext } from 'react';
import type { ArticleReader } from 'entities/article';

type ArticlesListValue = {
	articleReader: ArticleReader;
};

export const ArticlesListContext = createContext<ArticlesListValue | null>(null);
