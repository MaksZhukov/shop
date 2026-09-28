import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { WheelWidthDto } from './dto/wheelWidth.dto';

export const WHEEL_WIDTH_API = Symbol('WheelWidthApi');

@injectable()
export class WheelWidthApi {
	fetchWheelWidths(params?: CollectionParams) {
		return api.get<ApiResponse<WheelWidthDto[]>>('/wheel-widths', { params });
	}
}

export const wheelWidthApi = new WheelWidthApi();

