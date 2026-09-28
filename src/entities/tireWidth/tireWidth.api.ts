import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { TireWidthDto } from './dto/tireWidth.dto';

export const TIRE_WIDTH_API = Symbol('TireWidthApi');

@injectable()
export class TireWidthApi {
	fetchTireWidths(params: CollectionParams) {
		return api.get<ApiResponse<TireWidthDto[]>>('/tire-widths', { params });
	}
}

export const tireWidthApi = new TireWidthApi();

