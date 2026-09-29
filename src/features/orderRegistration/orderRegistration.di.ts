import { useStrictContext } from 'shared/hooks';
import { OrderRegistrationContext } from './orderRegistration.context';

export const useDI = () => useStrictContext(OrderRegistrationContext);
