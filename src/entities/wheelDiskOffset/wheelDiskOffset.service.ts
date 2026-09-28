import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { WHEEL_DISK_OFFSET_API, WheelDiskOffsetApi } from './wheelDiskOffset.api';
import type { WheelDiskOffsetReader } from './ports/wheelDiskOffset.port';
import type { CollectionParams } from 'shared/api/types';

@injectable()
export class WheelDiskOffsetService implements WheelDiskOffsetReader {
	constructor(@inject(WHEEL_DISK_OFFSET_API) private readonly wheelDiskOffsetApi: WheelDiskOffsetApi) {}

	fetchWheelDiskOffsets(params?: CollectionParams) {
		return this.wheelDiskOffsetApi.fetchWheelDiskOffsets(params);
	}
}
