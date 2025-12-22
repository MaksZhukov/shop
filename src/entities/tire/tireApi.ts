import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { Tire } from './tireTypes';

export const tireApi = {
	fetchTires: (params?: CollectionParams) => api.get<ApiResponse<Tire[]>>('/tires', { params }),
	fetchTire: (idOrSlug: string) =>
		api.get<ApiResponse<Tire>>(`/tires/${idOrSlug}`, {
			params: {
				populate: [
					'images',
					'brand.productBrandText',
					'seo.images',
					'snippets',
					'width',
					'height',
					'diameter',
					'order'
				]
			}
		})
};



