import { api } from '..';
import { ApiResponse, CollectionParams } from 'api/types';
import { Car } from './types';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const fetchCars = (
	params?: CollectionParams,
	isServerRequest: boolean = false
) =>
	api.get<ApiResponse<Car[]>>('/cars', {
		params,
		headers: { isServerRequest },
	});

export const fetchCar = (idOrSlug: string, isServerRequest = false) =>
	api.get<ApiResponse<Car>>(`/cars/${idOrSlug}`, {
		headers: { isServerRequest },
	});
