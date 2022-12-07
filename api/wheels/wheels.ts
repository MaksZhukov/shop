import { api } from '..';
import { ApiResponse, CollectionParams } from '../types';
import { Wheel } from './types';

export const fetchWheels = (params?: CollectionParams, isServerRequest = false) =>
	api.get<ApiResponse<Wheel[]>>('/wheels', { params, headers: { isServerRequest } });

export const fetchWheel = (idOrSlug: string, isServerRequest = false) =>
	api.get<ApiResponse<Wheel>>(`/wheels/${idOrSlug}`, {
		params: { populate: 'images' },
		headers: { isServerRequest },
	});
