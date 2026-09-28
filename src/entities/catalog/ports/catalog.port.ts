import type { CatalogApi } from '../catalog.api';

export type CatalogReader = Pick<CatalogApi, 'fetchTopCategories'>;
