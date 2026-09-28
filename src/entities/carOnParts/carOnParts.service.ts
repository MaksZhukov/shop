import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { CAR_ON_PARTS_API, CarOnPartsApi } from './carOnParts.api';
import type { CarOnPartsReader } from './ports/carOnParts.port';
import type { CollectionParams } from 'shared/api/types';

@injectable()
export class CarOnPartsService implements CarOnPartsReader {
	constructor(@inject(CAR_ON_PARTS_API) private readonly carOnPartsApi: CarOnPartsApi) {}

	fetchCarsOnParts(params?: CollectionParams) {
		return this.carOnPartsApi.fetchCarsOnParts(params);
	}

	fetchCarOnParts(idOrSlug: string) {
		return this.carOnPartsApi.fetchCarOnParts(idOrSlug);
	}
}
