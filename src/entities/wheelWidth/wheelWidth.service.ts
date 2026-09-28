import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { WHEEL_WIDTH_API, WheelWidthApi } from './wheelWidth.api';
import type { WheelWidthReader } from './ports/wheelWidth.port';
import type { CollectionParams } from 'shared/api/types';

@injectable()
export class WheelWidthService implements WheelWidthReader {
	constructor(@inject(WHEEL_WIDTH_API) private readonly wheelWidthApi: WheelWidthApi) {}

	fetchWheelWidths(params?: CollectionParams) {
		return this.wheelWidthApi.fetchWheelWidths(params);
	}
}
