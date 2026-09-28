import type { ArticleService } from 'entities/article';
import { createModuleInjector } from 'shared/di';

export const inject = createModuleInjector<typeof ArticleService>();
