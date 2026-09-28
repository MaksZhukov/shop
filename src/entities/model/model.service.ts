import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { MODEL_API, ModelApi } from './model.api';
import type { ModelReader } from './ports/model.port';
import type { CollectionParams } from 'shared/api/types';
import type { ModelDto } from './dto/model.dto';

@injectable()
export class ModelService implements ModelReader {
	constructor(@inject(MODEL_API) private readonly modelApi: ModelApi) {}

	fetchModels<T extends ModelDto>(params: CollectionParams) {
		return this.modelApi.fetchModels<T>(params);
	}

	fetchModelBySlug(slug: string, params: CollectionParams) {
		return this.modelApi.fetchModelBySlug(slug, params);
	}
}
