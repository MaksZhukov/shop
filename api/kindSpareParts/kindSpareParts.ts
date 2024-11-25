import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import { KindSparePart } from './types';

export const fetchKindSpareParts = (
	params: CollectionParams,
	{ abortController }: { abortController?: AbortController } = {}
) => api.get<ApiResponse<KindSparePart[]>>('/kind-spare-parts', { params, signal: abortController?.signal });
