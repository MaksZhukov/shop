import { API_MAX_LIMIT } from 'shared/api/constants';
import { brandApi, BrandWithSparePartsCount } from 'entities/brand';
import { SLUGIFY_FUELS, SLUGIFY_BODY_STYLES, SLUGIFY_TRANSMISSIONS } from 'entities/car';

export interface BrandsDataFilters {
	kindSparePart?: string | null;
	model?: string | null;
	generation?: string | null;
	volume?: string | null;
	fuel?: string | null;
	bodyStyle?: string | null;
	transmission?: string | null;
}

const buildSparePartsFilters = (filters: BrandsDataFilters) => ({
	sold: false,
	id: {
		$notNull: true
	},
	...(filters.kindSparePart && { kindSparePart: { slug: filters.kindSparePart } }),
	...(filters.model && { model: { slug: filters.model } }),
	...(filters.generation && { generation: { slug: filters.generation } }),
	...(filters.volume && { volume: { name: filters.volume } }),
	...(filters.fuel && { fuel: SLUGIFY_FUELS[filters.fuel] ?? filters.fuel }),
	...(filters.bodyStyle && { bodyStyle: SLUGIFY_BODY_STYLES[filters.bodyStyle] ?? filters.bodyStyle }),
	...(filters.transmission && { transmission: SLUGIFY_TRANSMISSIONS[filters.transmission] ?? filters.transmission })
});

export const sparePartsPageQueryFns = {
	fetchBrandsData: (filters: BrandsDataFilters = {}) => async (): Promise<BrandWithSparePartsCount[]> => {
		const sparePartsFilters = buildSparePartsFilters(filters);
		const {
			data: { data: brands }
		} = await brandApi.fetchBrands({
			populate: {
				spareParts: {
					count: true,
					filters: sparePartsFilters
				}
			},
			sort: 'name',
			pagination: { limit: API_MAX_LIMIT },
			filters: { spareParts: sparePartsFilters }
		});
		return brands as BrandWithSparePartsCount[];
	}
};
