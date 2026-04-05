import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { Car } from './model/carModel';

export const carApi = {
	fetchCars: (params?: CollectionParams) =>
		api.get<ApiResponse<Car[]>>('/cars', {
			params
		}),
	fetchCar: (idOrSlug: string) =>
		api.get<ApiResponse<Car>>(`/cars/${idOrSlug}`, {
			params: { populate: ['images', 'model', 'brand', 'generation', 'volume', 'seo.images'] }
		})
};



