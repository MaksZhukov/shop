import { api } from '..';
import { ApiResponse, CollectionParams } from 'api/types';
import { CarOnParts } from './types';

export const fetchCarsOnParts = (params?: CollectionParams) =>
	api.get<ApiResponse<CarOnParts[]>>('/cars-on-parts', {
		params
	});

export const fetchCarOnParts = (idOrSlug: string) => api.get<ApiResponse<CarOnParts>>(`/cars-on-parts/${idOrSlug}`);
