import getConfig from 'next/config';
import { api } from '..';
import { ApiResponse, CollectionParams } from '../types';
import { Product } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchProducts = (params?: CollectionParams) =>
	api.get<ApiResponse<Product[]>>('/products', { params });

export const fetchProduct = (idOrSlug: string, isServerRequest = false) =>
	api.get<ApiResponse<Product>>(`/products/${idOrSlug}`, {
		params: { populate: 'images' },
		...(isServerRequest
			? { baseURL: publicRuntimeConfig.backendLocalUrl + '/api' }
			: {}),
	});
