import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { Wheel } from './model/wheel.model';

export const WHEEL_API = Symbol('WheelApi');

@injectable()
export class WheelApi {
	fetchWheels(params?: CollectionParams) {
		return api.get<ApiResponse<Wheel[]>>('/wheels', { params });
	}

	fetchWheel(idOrSlug: string) {
		return api.get<ApiResponse<Wheel>>(`/wheels/${idOrSlug}`, {
			params: {
				populate: [
					'images',
					'model',
					'brand.productBrandTexts.wheelTextBrand',
					'seo.images',
					'snippets',
					'diskOffset',
					'width',
					'numberHoles',
					'diameter',
					'diameterCenterHole',
					'distanceBetweenCenters',
					'order'
				]
			}
		});
	}
}

export const wheelApi = new WheelApi();

