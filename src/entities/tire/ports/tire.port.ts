import type { TireApi } from '../tire.api';

export type TireReader = Pick<TireApi, 'fetchTires' | 'fetchTire'>;
