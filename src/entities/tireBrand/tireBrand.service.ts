import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { TIRE_BRAND_API, TireBrandApi } from './tireBrand.api';
import type { TireBrandReader } from './ports/tireBrand.port';
import type { CollectionParams } from 'shared/api/types';
import type { TireBrandDto } from './dto/tireBrand.dto';

@injectable()
export class TireBrandService implements TireBrandReader {
	constructor(@inject(TIRE_BRAND_API) private readonly tireBrandApi: TireBrandApi) {}

	fetchTireBrands<T extends TireBrandDto>(params: CollectionParams) {
		return this.tireBrandApi.fetchTireBrands<T>(params);
	}

	fetchTireBrandBySlug(slug: string, params: CollectionParams) {
		return this.tireBrandApi.fetchTireBrandBySlug(slug, params);
	}
}
