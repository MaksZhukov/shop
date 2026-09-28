import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { TIRE_WIDTH_API, TireWidthApi } from './tireWidth.api';
import type { TireWidthReader } from './ports/tireWidth.port';
import type { CollectionParams } from 'shared/api/types';

@injectable()
export class TireWidthService implements TireWidthReader {
	constructor(@inject(TIRE_WIDTH_API) private readonly tireWidthApi: TireWidthApi) {}

	fetchTireWidths(params: CollectionParams) {
		return this.tireWidthApi.fetchTireWidths(params);
	}
}
