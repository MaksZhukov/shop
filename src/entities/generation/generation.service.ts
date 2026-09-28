import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { GENERATION_API, GenerationApi } from './generation.api';
import type { GenerationReader } from './ports/generation.port';
import type { CollectionParams } from 'shared/api/types';
import type { GenerationDto } from './dto/generation.dto';

@injectable()
export class GenerationService implements GenerationReader {
	constructor(@inject(GENERATION_API) private readonly generationApi: GenerationApi) {}

	fetchGenerations<T extends GenerationDto = GenerationDto>(params: CollectionParams) {
		return this.generationApi.fetchGenerations<T>(params);
	}

	fetchGeneration<T extends GenerationDto>(params: CollectionParams) {
		return this.generationApi.fetchGeneration<T>(params);
	}
}
