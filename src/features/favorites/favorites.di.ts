import { useStrictContext } from 'shared/hooks';
import { FavoritesContext } from './favorites.context';

export const useDI = () => useStrictContext(FavoritesContext);
