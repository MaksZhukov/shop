import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { WheelNumberHoleDto } from './dto/wheelNumberHole.dto';

export const WHEEL_NUMBER_HOLE_API = Symbol('WheelNumberHoleApi');

@injectable()
export class WheelNumberHoleApi {
	fetchWheelNumberHoles(params?: CollectionParams) {
		return api.get<ApiResponse<WheelNumberHoleDto[]>>('/wheel-disk-offsets', { params });
	}
}

export const wheelNumberHoleApi = new WheelNumberHoleApi();

