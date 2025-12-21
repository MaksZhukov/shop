import { api } from 'shared/api';
import { ApiResponse, CollectionParams } from 'shared/api/types';
import { Generation } from './generationTypes';

export const generationApi = {
	fetchGenerations: (params: CollectionParams) => api.get<ApiResponse<Generation[]>>('/generations', { params }),
	fetchGeneration: <T extends Generation>(params: CollectionParams) =>
		api.get<ApiResponse<[T]>>('/generations', { params })
};
