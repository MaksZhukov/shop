import { useStrictContext } from 'shared/hooks';
import { TiresCatalogContext } from './tiresCatalog.context';

export const useDI = () => useStrictContext(TiresCatalogContext);
