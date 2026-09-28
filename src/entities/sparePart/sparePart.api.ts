import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { SparePart } from './model/sparePart.model';

export const SPARE_PART_API = Symbol('SparePartApi');

@injectable()
export class SparePartApi {
	fetchSpareParts(params?: CollectionParams) {
		return api.get<ApiResponse<SparePart[]>>('/spare-parts', {
			params
		});
	}

	fetchSparePart(idOrSlug: string) {
		return api.get<ApiResponse<SparePart>>(`/spare-parts/${idOrSlug}`, {
			params: {
				populate: [
					'images',
					'kindSparePart',
					'model',
					'brand.productBrandTexts.sparePartBrandText',
					'generation',
					'seo.images',
					'snippets',
					'volume',
					'order'
				]
			}
		});
	}
}

export const sparePartApi = new SparePartApi();

