import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { WHEEL_DIAMETER_API, WheelDiameterApi } from './wheelDiameter.api';
import type { WheelDiameterReader } from './ports/wheelDiameter.port';
import type { CollectionParams } from 'shared/api/types';

@injectable()
export class WheelDiameterService implements WheelDiameterReader {
	constructor(@inject(WHEEL_DIAMETER_API) private readonly wheelDiameterApi: WheelDiameterApi) {}

	fetchWheelDiameters(params?: CollectionParams) {
		return this.wheelDiameterApi.fetchWheelDiameters(params);
	}
}
