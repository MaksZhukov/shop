import type { BrandApi } from '../brand.api';

export type BrandReader = Pick<BrandApi, 'fetchBrands' | 'fetchBrandBySlug'>;
