import { api } from '..';
import { ApiResponse, CollectionParams, Product } from '../types';

export const fetchProducts = (params?: CollectionParams) =>
	api.get<ApiResponse<Product[]>>('/products', {
		params
	});
