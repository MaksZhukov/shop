import type { SparePartApi } from '../sparePart.api';

export type SparePartReader = Pick<SparePartApi, 'fetchSpareParts' | 'fetchSparePart'>;
