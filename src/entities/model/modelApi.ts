import { api } from 'shared/api';
import { ApiResponse, CollectionParams } from 'shared/api/types';
import { Model } from './modelTypes';

export const modelApi = {
	fetchModels: <T extends Model>(params: CollectionParams) => api.get<ApiResponse<T[]>>('/models', { params }),
	fetchModelBySlug: (slug: string, params: CollectionParams) =>
		api.get<ApiResponse<Model>>(`/models/${slug}`, { params: { field: 'slug', ...params } })
};



