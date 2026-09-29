import { useStrictContext } from 'shared/hooks';
import { FooterContext } from './footer.context';

export const useDI = () => useStrictContext(FooterContext);
