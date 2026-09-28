import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { Cabin } from './model/cabin.model';

export const CABIN_API = Symbol('CabinApi');

@injectable()
export class CabinApi {
	fetchCabins(params?: CollectionParams) {
		return api.get<ApiResponse<Cabin[]>>('/cabins', {
			params
		});
	}

	fetchCabin(idOrSlug: string) {
		return api.get<ApiResponse<Cabin>>(`/cabins/${idOrSlug}`, {
			params: {
				populate: [
					'images',
					'kindSparePart',
					'model',
					'brand.productBrandTexts.cabinTextBrand',
					'generation',
					'seo.images',
					'snippets',
					'order'
				]
			}
		});
	}
}

export const cabinApi = new CabinApi();

