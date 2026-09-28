import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { WHEEL_API, WheelApi } from './wheel.api';
import type { WheelReader } from './ports/wheel.port';
import type { CollectionParams } from 'shared/api/types';

@injectable()
export class WheelService implements WheelReader {
	constructor(@inject(WHEEL_API) private readonly wheelApi: WheelApi) {}

	fetchWheels(params?: CollectionParams) {
		return this.wheelApi.fetchWheels(params);
	}

	fetchWheel(idOrSlug: string) {
		return this.wheelApi.fetchWheel(idOrSlug);
	}
}
