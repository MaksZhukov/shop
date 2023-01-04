import getConfig from 'next/config';
import { api } from '..';
import { ApiResponse, CollectionParams } from '../types';
import { SparePart } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchSpareParts = (params?: CollectionParams) =>
	api.get<ApiResponse<SparePart[]>>('/spare-parts', {
		params,
	});

export const fetchSparePart = (idOrSlug: string) =>
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
				'volume'
			],
		},
	});
