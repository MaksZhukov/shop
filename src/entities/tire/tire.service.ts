import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { TIRE_API, TireApi } from './tire.api';
import type { TireReader } from './ports/tire.port';
import type { CollectionParams } from 'shared/api/types';

@injectable()
export class TireService implements TireReader {
	constructor(@inject(TIRE_API) private readonly tireApi: TireApi) {}

	fetchTires(params?: CollectionParams) {
		return this.tireApi.fetchTires(params);
	}

	fetchTire(idOrSlug: string) {
		return this.tireApi.fetchTire(idOrSlug);
	}
}
