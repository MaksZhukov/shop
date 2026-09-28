import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { CABIN_API, CabinApi } from './cabin.api';
import type { CabinReader } from './ports/cabin.port';
import type { CollectionParams } from 'shared/api/types';

@injectable()
export class CabinService implements CabinReader {
	constructor(@inject(CABIN_API) private readonly cabinApi: CabinApi) {}

	fetchCabins(params?: CollectionParams) {
		return this.cabinApi.fetchCabins(params);
	}

	fetchCabin(idOrSlug: string) {
		return this.cabinApi.fetchCabin(idOrSlug);
	}
}
