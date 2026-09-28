import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { BrandDto } from './dto/brand.dto';

export const BRAND_API = Symbol('BrandApi');

@injectable()
export class BrandApi {
	fetchBrands<T extends BrandDto>(params: CollectionParams) {
		return api.get<ApiResponse<T[]>>('/brands', {
			params
		});
	}

	fetchBrandBySlug(slug: string, params: CollectionParams) {
		return api.get<ApiResponse<BrandDto>>(`/brands/${slug}`, { params: { field: 'slug', ...params } });
	}
}

export const brandApi = new BrandApi();

