import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { ModelDto } from './dto/model.dto';

export const MODEL_API = Symbol('ModelApi');

@injectable()
export class ModelApi {
	fetchModels<T extends ModelDto>(params: CollectionParams) {
		return api.get<ApiResponse<T[]>>('/models', { params });
	}

	fetchModelBySlug(slug: string, params: CollectionParams) {
		return api.get<ApiResponse<ModelDto>>(`/models/${slug}`, { params: { field: 'slug', ...params } });
	}
}

export const modelApi = new ModelApi();

