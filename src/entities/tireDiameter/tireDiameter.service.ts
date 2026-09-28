import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { TIRE_DIAMETER_API, TireDiameterApi } from './tireDiameter.api';
import type { TireDiameterReader } from './ports/tireDiameter.port';
import type { CollectionParams } from 'shared/api/types';

@injectable()
export class TireDiameterService implements TireDiameterReader {
	constructor(@inject(TIRE_DIAMETER_API) private readonly tireDiameterApi: TireDiameterApi) {}

	fetchTireDiameters(params: CollectionParams) {
		return this.tireDiameterApi.fetchTireDiameters(params);
	}
}
