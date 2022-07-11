import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import { SparePart } from './types';

export const getSpareParts = (params: CollectionParams) =>
	api.get<ApiResponse<SparePart[]>>('/spare-parts', { params });
