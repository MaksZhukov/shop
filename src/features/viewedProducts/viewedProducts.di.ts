import { useStrictContext } from 'shared/hooks';
import { ViewedProductsContext } from './viewedProducts.context';

export const useDI = () => useStrictContext(ViewedProductsContext);
