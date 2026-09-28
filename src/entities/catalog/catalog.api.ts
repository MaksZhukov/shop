import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse } from 'shared/api/types';
import type { TopCategoryDto } from './dto/catalog.dto';

export const CATALOG_API = Symbol('CatalogApi');

@injectable()
export class CatalogApi {
	fetchTopCategories() {
		return api.get<ApiResponse<TopCategoryDto[]>>(`/catalog/top-categories`);
	}
}

export const catalogApi = new CatalogApi();

