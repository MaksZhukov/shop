import type { TireBrandApi } from '../tireBrand.api';

export type TireBrandReader = Pick<TireBrandApi, 'fetchTireBrands' | 'fetchTireBrandBySlug'>;
