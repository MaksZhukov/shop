import { api } from '..';
import { ApiResponse, CollectionParams } from '../types';
import { Product } from './types';

export const fetchProducts = (params?: CollectionParams) =>
	api.get<ApiResponse<Product[]>>('/products', { params });

export const fetchProduct = (idOrSlug: string) =>
	api.get<ApiResponse<Product>>(`/products/${idOrSlug}`, {
		params: { populate: 'images' },
	});
