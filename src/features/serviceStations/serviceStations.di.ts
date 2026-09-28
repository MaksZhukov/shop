import { useStrictContext } from 'shared/hooks';
import { ServiceStationsContext } from './serviceStations.context';

export const useDI = () => useStrictContext(ServiceStationsContext);
