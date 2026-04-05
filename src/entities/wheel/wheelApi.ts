import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { Wheel } from './model/wheelModel';

export const wheelApi = {
	fetchWheels: (params?: CollectionParams) => api.get<ApiResponse<Wheel[]>>('/wheels', { params }),
	fetchWheel: (idOrSlug: string) =>
		api.get<ApiResponse<Wheel>>(`/wheels/${idOrSlug}`, {
			params: {
				populate: [
					'images',
					'model',
					'brand.productBrandTexts.wheelTextBrand',
					'seo.images',
					'snippets',
					'diskOffset',
					'width',
					'numberHoles',
					'diameter',
					'diameterCenterHole',
					'distanceBetweenCenters',
					'order'
				]
			}
		})
};



