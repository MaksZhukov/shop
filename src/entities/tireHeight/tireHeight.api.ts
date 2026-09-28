import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { TireHeightDto } from './dto/tireHeight.dto';

export const TIRE_HEIGHT_API = Symbol('TireHeightApi');

@injectable()
export class TireHeightApi {
	fetchTireHeights(params: CollectionParams) {
		return api.get<ApiResponse<TireHeightDto[]>>('/tire-heights', { params });
	}
}

export const tireHeightApi = new TireHeightApi();

