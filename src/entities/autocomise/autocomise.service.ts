import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { AUTOCOMISE_API, AutocomiseApi } from './autocomise.api';
import type { AutocomiseReader } from './ports/autocomise.port';
import type { CollectionParams } from 'shared/api/types';

@injectable()
export class AutocomiseService implements AutocomiseReader {
	constructor(@inject(AUTOCOMISE_API) private readonly autocomiseApi: AutocomiseApi) {}

	fetchAutocomises(params: CollectionParams) {
		return this.autocomiseApi.fetchAutocomises(params);
	}

	fetchAutocomis(slug: string) {
		return this.autocomiseApi.fetchAutocomis(slug);
	}
}
