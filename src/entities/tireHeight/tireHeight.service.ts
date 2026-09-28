import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { TIRE_HEIGHT_API, TireHeightApi } from './tireHeight.api';
import type { TireHeightReader } from './ports/tireHeight.port';
import type { CollectionParams } from 'shared/api/types';

@injectable()
export class TireHeightService implements TireHeightReader {
	constructor(@inject(TIRE_HEIGHT_API) private readonly tireHeightApi: TireHeightApi) {}

	fetchTireHeights(params: CollectionParams) {
		return this.tireHeightApi.fetchTireHeights(params);
	}
}
