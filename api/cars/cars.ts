import { api } from '..';
import { ApiResponse, CollectionParams } from 'api/types';
import { Car } from './types';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const fetchCars = (params?: CollectionParams) =>
	api.get<ApiResponse<Car[]>>('/cars', { params });

export const fetchCar = (idOrSlug: string, isServerRequest = false) =>
	api.get<ApiResponse<Car>>(`/cars/${idOrSlug}`, {
		...(isServerRequest
			? { baseURL: publicRuntimeConfig.backendLocalUrl + '/api' }
			: {}),
	});