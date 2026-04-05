import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { Generation } from './model/generationModel';

export const generationApi = {
	fetchGenerations: (params: CollectionParams) => api.get<ApiResponse<Generation[]>>('/generations', { params }),
	fetchGeneration: <T extends Generation>(params: CollectionParams) =>
		api.get<ApiResponse<[T]>>('/generations', { params })
};
