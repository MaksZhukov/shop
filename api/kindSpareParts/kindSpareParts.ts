import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import { KindSparePart } from './types';

export const fetchKindSpareParts = <T extends KindSparePart>(
	params: CollectionParams,
	{ abortController }: { abortController?: AbortController } = {}
) => api.get<ApiResponse<T[]>>('/kind-spare-parts', { params, signal: abortController?.signal });
