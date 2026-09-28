import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { WheelDiskOffsetDto } from './dto/wheelDiskOffset.dto';

export const WHEEL_DISK_OFFSET_API = Symbol('WheelDiskOffsetApi');

@injectable()
export class WheelDiskOffsetApi {
	fetchWheelDiskOffsets(params?: CollectionParams) {
		return api.get<ApiResponse<WheelDiskOffsetDto[]>>('/wheel-disk-offsets', { params });
	}
}

export const wheelDiskOffsetApi = new WheelDiskOffsetApi();

