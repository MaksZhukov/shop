import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { SparePart } from './sparePartTypes';

export const sparePartApi = {
	fetchSpareParts: (params?: CollectionParams) =>
		api.get<ApiResponse<SparePart[]>>('/spare-parts', {
			params
		}),
	fetchSparePart: (idOrSlug: string) =>
		api.get<ApiResponse<SparePart>>(`/spare-parts/${idOrSlug}`, {
			params: {
				populate: [
					'images',
					'kindSparePart',
					'model',
					'brand.productBrandTexts.sparePartBrandText',
					'generation',
					'seo.images',
					'snippets',
					'volume',
					'order'
				]
			}
		})
};



