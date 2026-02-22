import { API_MAX_LIMIT } from 'shared/api/constants';
import { brandApi, BrandWithSparePartsCount, BrandWithWheelsCount } from 'entities/brand';
import { SLUGIFY_KIND_WHEELS } from 'entities/wheel';

export const wheelsPageQueryFns = {
	fetchBrandsData:
		({ kind }: { kind?: string | null }) =>
		async (): Promise<BrandWithWheelsCount[]> => {
			const {
				data: { data: brands }
			} = await brandApi.fetchBrands({
				populate: {
					wheels: {
						count: true,
						filters: {
							...(kind && { kind: SLUGIFY_KIND_WHEELS[kind] })
						}
					}
				},
				sort: 'name',
				pagination: { limit: API_MAX_LIMIT },
				filters: {
					wheels: {
						id: { $notNull: true },
						...(kind && { kind: SLUGIFY_KIND_WHEELS[kind] })
					}
				}
			});
			return brands as BrandWithWheelsCount[];
		}
};
