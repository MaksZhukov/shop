import { useStrictContext } from 'shared/hooks';
import { ArticlesListContext } from './articlesList.context';

export const useDI = () => useStrictContext(ArticlesListContext);
