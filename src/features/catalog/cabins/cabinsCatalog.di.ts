import { useStrictContext } from 'shared/hooks';
import { CabinsCatalogContext } from './cabinsCatalog.context';

export const useDI = () => useStrictContext(CabinsCatalogContext);
