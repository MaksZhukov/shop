import { api } from '..';
import { ApiResponse, CollectionParams } from '../types';
import { Order } from './types';

export const createOrder = (
	data: Omit<Order, 'products' | 'id'> & { products: number[] }
) => api.post<ApiResponse<Order>>('/orders', { data });
