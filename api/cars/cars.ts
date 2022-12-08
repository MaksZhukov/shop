import { api } from '..';
import { ApiResponse, CollectionParams } from 'api/types';
import { Car } from './types';

export const fetchCars = (params?: CollectionParams) =>
	api.get<ApiResponse<Car[]>>('/cars', {
		params,
	});

export const fetchCar = (idOrSlug: string) => api.get<ApiResponse<Car>>(`/cars/${idOrSlug}`);
