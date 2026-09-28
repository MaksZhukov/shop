import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { Tire } from './model/tire.model';

export const TIRE_API = Symbol('TireApi');

@injectable()
export class TireApi {
	fetchTires(params?: CollectionParams) {
		return api.get<ApiResponse<Tire[]>>('/tires', { params });
	}

	fetchTire(idOrSlug: string) {
		return api.get<ApiResponse<Tire>>(`/tires/${idOrSlug}`, {
			params: {
				populate: [
					'images',
					'brand.productBrandText',
					'seo.images',
					'snippets',
					'width',
					'height',
					'diameter',
					'order'
				]
			}
		});
	}
}

export const tireApi = new TireApi();

