import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { Cabin } from './cabinTypes';

export const cabinApi = {
	fetchCabins: (params?: CollectionParams) =>
		api.get<ApiResponse<Cabin[]>>('/cabins', {
			params
		}),
	fetchCabin: (idOrSlug: string) =>
		api.get<ApiResponse<Cabin>>(`/cabins/${idOrSlug}`, {
			params: {
				populate: [
					'images',
					'kindSparePart',
					'model',
					'brand.productBrandTexts.cabinTextBrand',
					'generation',
					'seo.images',
					'snippets',
					'order'
				]
			}
		})
};



