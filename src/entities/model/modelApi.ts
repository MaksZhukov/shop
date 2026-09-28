import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { ModelDto } from './dto/model.dto';

export const modelApi = {
	fetchModels: <T extends ModelDto>(params: CollectionParams) => api.get<ApiResponse<T[]>>('/models', { params }),
	fetchModelBySlug: (slug: string, params: CollectionParams) =>
		api.get<ApiResponse<ModelDto>>(`/models/${slug}`, { params: { field: 'slug', ...params } })
};



