import { useStrictContext } from 'shared/hooks';
import { HeaderContext } from './header.context';

export const useDI = () => useStrictContext(HeaderContext);
