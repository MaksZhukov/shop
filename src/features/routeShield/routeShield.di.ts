import { useStrictContext } from 'shared/hooks';
import { RouteShieldContext } from './routeShield.context';

export const useDI = () => useStrictContext(RouteShieldContext);
