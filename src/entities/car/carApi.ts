import { api } from 'shared/api';
import { ApiResponse, CollectionParams } from 'shared/api/types';
import { Car } from './carTypes';

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



