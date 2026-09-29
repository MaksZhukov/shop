import { useStrictContext } from 'shared/hooks';
import { BuyContext } from './buy.context';

export const useDI = () => useStrictContext(BuyContext);
