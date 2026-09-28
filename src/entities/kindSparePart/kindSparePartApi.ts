import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { KindSparePartDto } from './dto/kindSparePart.dto';

export const kindSparePartApi = {
	fetchKindSpareParts: <T extends KindSparePartDto>(
		params: CollectionParams,
		{ abortController }: { abortController?: AbortController } = {}
	) => api.get<ApiResponse<T[]>>('/kind-spare-parts', { params, signal: abortController?.signal })
};



