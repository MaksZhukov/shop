import { useStrictContext } from 'shared/hooks';
import { WheelsCatalogContext } from './wheelsCatalog.context';

export const useDI = () => useStrictContext(WheelsCatalogContext);
