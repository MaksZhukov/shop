import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { CAR_API, CarApi } from './car.api';
import type { CarReader } from './ports/car.port';
import type { CollectionParams } from 'shared/api/types';

@injectable()
export class CarService implements CarReader {
	constructor(@inject(CAR_API) private readonly carApi: CarApi) {}

	fetchCars(params?: CollectionParams) {
		return this.carApi.fetchCars(params);
	}

	fetchCar(idOrSlug: string) {
		return this.carApi.fetchCar(idOrSlug);
	}
}
