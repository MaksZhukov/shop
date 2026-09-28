import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { TireBrandDto } from './dto/tireBrand.dto';

export const TIRE_BRAND_API = Symbol('TireBrandApi');

@injectable()
export class TireBrandApi {
	fetchTireBrands<T extends TireBrandDto>(params: CollectionParams) {
		return api.get<ApiResponse<T[]>>('/tire-brands', { params });
	}

	fetchTireBrandBySlug(slug: string, params: CollectionParams) {
		return api.get<ApiResponse<TireBrandDto>>(`/tire-brands/${slug}`, { params });
	}
}

export const tireBrandApi = new TireBrandApi();

