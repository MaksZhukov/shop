import getConfig from 'next/config';
import { api, fetchApi } from '..';
import { ApiResponse, CollectionParams } from '../types';
import { Cabin } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchCabins = (params?: CollectionParams) =>
	api.get<ApiResponse<Cabin[]>>('/cabins', {
		params
	});

export const fetchCabin = (idOrSlug: string) =>
	fetchApi<Cabin>(`/cabins/${idOrSlug}`, {
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
	});
