import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { WheelDiameterDto } from './dto/wheelDiameter.dto';

export const WHEEL_DIAMETER_API = Symbol('WheelDiameterApi');

@injectable()
export class WheelDiameterApi {
	fetchWheelDiameters(params?: CollectionParams) {
		return api.get<ApiResponse<WheelDiameterDto[]>>('/wheel-diameters', { params });
	}
}

export const wheelDiameterApi = new WheelDiameterApi();

