import { ArticleService } from 'entities/article';
import { createModuleInjector } from 'shared/di';
import { useStrictContext } from 'shared/hooks';
import { ArticlesListContext } from './articlesList.context';

export const inject = createModuleInjector([ArticleService]);

export const useDI = () => useStrictContext(ArticlesListContext);
