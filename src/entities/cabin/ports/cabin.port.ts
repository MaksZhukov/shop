import type { CabinApi } from '../cabin.api';

export type CabinReader = Pick<CabinApi, 'fetchCabins' | 'fetchCabin'>;
