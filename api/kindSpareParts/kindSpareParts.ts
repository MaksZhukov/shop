import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import { KindSparePart } from './types';

export const fetchKindSpareParts = (params: CollectionParams) =>
    api.get<ApiResponse<KindSparePart[]>>('/kind-spare-parts', { params });
