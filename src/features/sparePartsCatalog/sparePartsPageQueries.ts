import { API_MAX_LIMIT } from 'shared/api/constants';
import { brandApi, BrandWithSparePartsCount } from 'entities/brand';

export const sparePartsPageQueryFns = {
	fetchBrandsData: (kindSparePartSlug?: string | null) => async (): Promise<BrandWithSparePartsCount[]> => {
		const filters = {
			sold: false,
			id: {
				$notNull: true
			},
			...(kindSparePartSlug && { kindSparePart: { slug: kindSparePartSlug } })
		};
		const {
			data: { data: brands }
		} = await brandApi.fetchBrands({
			populate: {
				spareParts: {
					count: true,
					filters
				}
			},
			sort: 'name',
			pagination: { limit: API_MAX_LIMIT },
			filters: { spareParts: filters }
		});
		return brands as BrandWithSparePartsCount[];
	}
};
