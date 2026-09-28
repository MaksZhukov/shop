import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { WHEEL_DIAMETER_CENTER_HOLE_API, WheelDiameterCenterHoleApi } from './wheelDiameterCenterHole.api';
import type { WheelDiameterCenterHoleReader } from './ports/wheelDiameterCenterHole.port';
import type { CollectionParams } from 'shared/api/types';

@injectable()
export class WheelDiameterCenterHoleService implements WheelDiameterCenterHoleReader {
	constructor(@inject(WHEEL_DIAMETER_CENTER_HOLE_API) private readonly wheelDiameterCenterHoleApi: WheelDiameterCenterHoleApi) {}

	fetchWheelDiameterCenterHoles(params?: CollectionParams) {
		return this.wheelDiameterCenterHoleApi.fetchWheelDiameterCenterHoles(params);
	}
}
