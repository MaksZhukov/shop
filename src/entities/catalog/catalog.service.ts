import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { CATALOG_API, CatalogApi } from './catalog.api';
import type { CatalogReader } from './ports/catalog.port';

@injectable()
export class CatalogService implements CatalogReader {
	constructor(@inject(CATALOG_API) private readonly catalogApi: CatalogApi) {}

	fetchTopCategories() {
		return this.catalogApi.fetchTopCategories();
	}
}
