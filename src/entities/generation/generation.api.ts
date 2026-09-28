import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { GenerationDto } from './dto/generation.dto';

export const GENERATION_API = Symbol('GenerationApi');

@injectable()
export class GenerationApi {
	fetchGenerations<T extends GenerationDto = GenerationDto>(params: CollectionParams) {
		return api.get<ApiResponse<T[]>>('/generations', { params });
	}

	fetchGeneration<T extends GenerationDto>(params: CollectionParams) {
		return api.get<ApiResponse<[T]>>('/generations', { params });
	}
}

export const generationApi = new GenerationApi();

