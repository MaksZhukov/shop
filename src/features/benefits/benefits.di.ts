import { useStrictContext } from 'shared/hooks';
import { BenefitsContext } from './benefits.context';

export const useDI = () => useStrictContext(BenefitsContext);
