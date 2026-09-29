import { useStrictContext } from 'shared/hooks';
import { PaymentContext } from './payment.context';

export const useDI = () => useStrictContext(PaymentContext);
