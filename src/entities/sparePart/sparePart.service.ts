import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { SPARE_PART_API, SparePartApi } from './sparePart.api';
import type { SparePartReader } from './ports/sparePart.port';
import type { CollectionParams } from 'shared/api/types';

@injectable()
export class SparePartService implements SparePartReader {
	constructor(@inject(SPARE_PART_API) private readonly sparePartApi: SparePartApi) {}

	fetchSpareParts(params?: CollectionParams) {
		return this.sparePartApi.fetchSpareParts(params);
	}

	fetchSparePart(idOrSlug: string) {
		return this.sparePartApi.fetchSparePart(idOrSlug);
	}
}
