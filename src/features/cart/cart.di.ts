import { useStrictContext } from 'shared/hooks';
import { CartContext } from './cart.context';

export const useDI = () => useStrictContext(CartContext);
