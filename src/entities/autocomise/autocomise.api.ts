import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { Autocomis } from './model/autocomise.model';

export const AUTOCOMISE_API = Symbol('AutocomiseApi');

@injectable()
export class AutocomiseApi {
	fetchAutocomises(params: CollectionParams) {
		return api.get<ApiResponse<Autocomis[]>>('/autocomises', {
			params
		});
	}

	fetchAutocomis(slug: string) {
		return api.get<ApiResponse<Autocomis>>(`/autocomises/${slug}`);
	}
}

export const autocomiseApi = new AutocomiseApi();

