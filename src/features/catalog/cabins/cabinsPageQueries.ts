import { API_MAX_LIMIT } from 'shared/api/constants';
import { BrandService, type BrandWithCabinsCount, type BrandWithSparePartsCount, type BrandWithWheelsCount } from 'entities/brand';

export const cabinsPageQueryFns = {
	fetchBrandsData:
		(brandService: BrandService, kindSparePartSlug?: string | null) =>
		async (): Promise<BrandWithCabinsCount[]> => {
		const {
			data: { data: brands }
		} = await brandService.fetchBrands({
			populate: {
				cabins: {
					count: true,
					filters: { ...(kindSparePartSlug && { kindSparePart: { slug: kindSparePartSlug } }) }
				}
			},
			sort: 'name',
			pagination: { limit: API_MAX_LIMIT },
			filters: {
				cabins: {
					id: {
						$notNull: true
					},
					...(kindSparePartSlug && { kindSparePart: { slug: kindSparePartSlug } })
				}
			}
		});
		return brands as BrandWithCabinsCount[];
	}
};
