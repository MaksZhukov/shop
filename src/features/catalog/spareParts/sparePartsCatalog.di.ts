import { useStrictContext } from 'shared/hooks';
import { SparePartsCatalogContext } from './sparePartsCatalog.context';

export const useDI = () => useStrictContext(SparePartsCatalogContext);
