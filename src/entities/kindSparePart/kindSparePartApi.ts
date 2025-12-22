import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { KindSparePart } from './kindSparePartTypes';

export const kindSparePartApi = {
	fetchKindSpareParts: <T extends KindSparePart>(
		params: CollectionParams,
		{ abortController }: { abortController?: AbortController } = {}
	) => api.get<ApiResponse<T[]>>('/kind-spare-parts', { params, signal: abortController?.signal })
};



