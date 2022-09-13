import { api } from 'api';
import { KindSparePart } from 'api/spareParts/types';
import { ApiResponse, CollectionParams } from 'api/types';

export const fetchSpareParts = (params: CollectionParams) =>
	api.get<ApiResponse<KindSparePart[]>>('/spare-parts', { params });
