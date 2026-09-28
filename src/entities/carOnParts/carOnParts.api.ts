import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { CarOnParts } from './model/carOnParts.model';

export const CAR_ON_PARTS_API = Symbol('CarOnPartsApi');

@injectable()
export class CarOnPartsApi {
	fetchCarsOnParts(params?: CollectionParams) {
		return api.get<ApiResponse<CarOnParts[]>>('/cars-on-parts', {
			params
		});
	}

	fetchCarOnParts(idOrSlug: string) {
		return api.get<ApiResponse<CarOnParts>>(`/cars-on-parts/${idOrSlug}`);
	}
}

export const carOnPartsApi = new CarOnPartsApi();

