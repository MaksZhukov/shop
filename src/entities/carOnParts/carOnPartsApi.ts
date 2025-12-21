import { api } from 'shared/api';
import { ApiResponse, CollectionParams } from 'shared/api/types';
import { CarOnParts } from './carOnPartsTypes';

export const carOnPartsApi = {
	fetchCarsOnParts: (params?: CollectionParams) =>
		api.get<ApiResponse<CarOnParts[]>>('/cars-on-parts', {
			params
		}),
	fetchCarOnParts: (idOrSlug: string) => api.get<ApiResponse<CarOnParts>>(`/cars-on-parts/${idOrSlug}`)
};



