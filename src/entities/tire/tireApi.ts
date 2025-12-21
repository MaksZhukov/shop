import { api } from 'shared/api';
import { ApiResponse, CollectionParams } from 'shared/api/types';
import { Tire } from './tireTypes';

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



