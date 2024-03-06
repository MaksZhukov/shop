import getConfig from 'next/config';
import { api, fetchApi } from '..';
import { ApiResponse, CollectionParams } from '../types';
import { SparePart } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchSpareParts = (params?: CollectionParams) =>
	api.get<ApiResponse<SparePart[]>>('/spare-parts', {
		params
	});

export const fetchSparePart = (idOrSlug: string) =>
	fetchApi<SparePart>(`/spare-parts/${idOrSlug}`, {
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
	});
