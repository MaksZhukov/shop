import { api } from '..';
import { ApiResponse, CollectionParams } from '../types';
import { Wheel } from './types';

export const fetchWheels = (params?: CollectionParams) => api.get<ApiResponse<Wheel[]>>('/wheels', { params });

export const fetchWheel = (idOrSlug: string) =>
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
			],
		},
	});
