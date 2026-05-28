import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { Generation } from './model/generationModel';

export const generationApi = {
	fetchGenerations: <T extends Generation = Generation>(params: CollectionParams) =>
		api.get<ApiResponse<T[]>>('/generations', { params }),
	fetchGeneration: <T extends Generation>(params: CollectionParams) =>
		api.get<ApiResponse<[T]>>('/generations', { params })
};
