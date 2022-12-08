import { api } from '..';
import { ApiResponse, CollectionParams } from '../types';
import { Tire } from './types';

export const fetchTires = (params?: CollectionParams) => api.get<ApiResponse<Tire[]>>('/tires', { params });

export const fetchTire = (idOrSlug: string) =>
	api.get<ApiResponse<Tire>>(`/tires/${idOrSlug}`, {
		params: { populate: 'images' },
	});
