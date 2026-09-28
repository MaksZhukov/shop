import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { BRAND_API, BrandApi } from './brand.api';
import type { BrandReader } from './ports/brand.port';
import type { CollectionParams } from 'shared/api/types';
import type { BrandDto } from './dto/brand.dto';

@injectable()
export class BrandService implements BrandReader {
	constructor(@inject(BRAND_API) private readonly brandApi: BrandApi) {}

	fetchBrands<T extends BrandDto>(params: CollectionParams) {
		return this.brandApi.fetchBrands<T>(params);
	}

	fetchBrandBySlug(slug: string, params: CollectionParams) {
		return this.brandApi.fetchBrandBySlug(slug, params);
	}
}
