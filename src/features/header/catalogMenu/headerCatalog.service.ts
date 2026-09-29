import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import Router from 'next/router';
import { CatalogService, type TopCategory } from 'entities/catalog';

const MOBILE_CATALOG_PATH = '/mobile-catalog';

@injectable()
export class HeaderCatalogService {
	constructor(@inject(CatalogService) private readonly catalogService: CatalogService) {}

	async fetchTopCategories(): Promise<TopCategory[]> {
		const { data } = await this.catalogService.fetchTopCategories();
		return data.data;
	}

	openMobileCatalog() {
		return Router.push(MOBILE_CATALOG_PATH);
	}
}
