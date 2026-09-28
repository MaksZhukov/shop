import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { WHEEL_NUMBER_HOLE_API, WheelNumberHoleApi } from './wheelNumberHole.api';
import type { WheelNumberHoleReader } from './ports/wheelNumberHole.port';
import type { CollectionParams } from 'shared/api/types';

@injectable()
export class WheelNumberHoleService implements WheelNumberHoleReader {
	constructor(@inject(WHEEL_NUMBER_HOLE_API) private readonly wheelNumberHoleApi: WheelNumberHoleApi) {}

	fetchWheelNumberHoles(params?: CollectionParams) {
		return this.wheelNumberHoleApi.fetchWheelNumberHoles(params);
	}
}
