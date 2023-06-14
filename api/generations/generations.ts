import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import { Generation } from './types';

export const fetchGenerations = (params: CollectionParams) =>
	api.get<ApiResponse<Generation[]>>('/generations', { params });
