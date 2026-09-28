import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { TireDiameterDto } from './dto/tireDiameter.dto';

export const TIRE_DIAMETER_API = Symbol('TireDiameterApi');

@injectable()
export class TireDiameterApi {
	fetchTireDiameters(params: CollectionParams) {
		return api.get<ApiResponse<TireDiameterDto[]>>('/tire-diameters', { params });
	}
}

export const tireDiameterApi = new TireDiameterApi();

