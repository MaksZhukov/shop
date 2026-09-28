import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { GenerationDto } from './dto/generation.dto';

export const generationApi = {
	fetchGenerations: <T extends GenerationDto = GenerationDto>(params: CollectionParams) =>
		api.get<ApiResponse<T[]>>('/generations', { params }),
	fetchGeneration: <T extends GenerationDto>(params: CollectionParams) =>
		api.get<ApiResponse<[T]>>('/generations', { params })
};
