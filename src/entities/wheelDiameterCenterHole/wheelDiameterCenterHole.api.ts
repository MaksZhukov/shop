import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { WheelDiameterCenterHoleDto } from './dto/wheelDiameterCenterHole.dto';

export const WHEEL_DIAMETER_CENTER_HOLE_API = Symbol('WheelDiameterCenterHoleApi');

@injectable()
export class WheelDiameterCenterHoleApi {
	fetchWheelDiameterCenterHoles(params?: CollectionParams) {
		return api.get<ApiResponse<WheelDiameterCenterHoleDto[]>>('/wheel-diameter-center-holes', { params });
	}
}

export const wheelDiameterCenterHoleApi = new WheelDiameterCenterHoleApi();

