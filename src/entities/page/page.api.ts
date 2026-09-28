import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import { getRandomBackendLocalUrl } from 'shared/services/BackendUrlService';
import type { DefaultPage } from './model/page.model';

export const PAGE_API = Symbol('PageApi');

@injectable()
export class PageApi {
	fetchPage<T = DefaultPage>(pageUrl: string, params: CollectionParams = { populate: 'seo.images' }) {
		return () =>
			api.get<ApiResponse<T>>(`/page-${pageUrl}`, {
				params,
				baseURL: getRandomBackendLocalUrl() + '/api'
			});
	}
}

export const pageApi = new PageApi();

