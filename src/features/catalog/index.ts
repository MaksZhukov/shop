export { Catalog } from './ui';
export type { CatalogSlots } from './ui';
export { mapToCatalogReferences } from './lib/mapToCatalogReferences';
export type { CatalogReference } from './ui/types';
export { CatalogSpareParts } from './catalogSpareParts';
export { CatalogCabins } from './catalogCabins';
export { CatalogTires } from './catalogTires';
export { CatalogWheels } from './catalogWheels';
export { inject } from './spareParts';
export {
	generateFiltersByQuery as generateSparePartsFiltersByQuery,
	useSparePartsCatalogFiltersStore
} from './spareParts';
export {
	buildPageProps as buildSparePartsPageProps,
	parseSlugParam as parseSparePartsSlug,
	sparePartsBrandsQueryKey,
	sparePartsPageQueryFns
} from './spareParts';
export {
	buildPageProps as buildCabinsPageProps,
	parseSlugParam as parseCabinsSlug,
	cabinsBrandsQueryKey,
	cabinsPageQueryFns
} from './cabins';
export {
	buildPageProps as buildWheelsPageProps,
	parseSlugParam as parseWheelsSlug,
	wheelsBrandsQueryKey,
	wheelsPageQueryFns
} from './wheels';
export {
	buildPageProps as buildTiresPageProps,
	buildProductPageProps as buildTireProductPageProps,
	parseSlugParam as parseTiresSlug
} from './tires';
