import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { Car } from './model/car.model';

export const CAR_API = Symbol('CarApi');

@injectable()
export class CarApi {
	fetchCars(params?: CollectionParams) {
		return api.get<ApiResponse<Car[]>>('/cars', {
			params
		});
	}

	fetchCar(idOrSlug: string) {
		return api.get<ApiResponse<Car>>(`/cars/${idOrSlug}`, {
			params: { populate: ['images', 'model', 'brand', 'generation', 'volume', 'seo.images'] }
		});
	}
}

export const carApi = new CarApi();

