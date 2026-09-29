import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import Router from 'next/router';
import { CatalogService, type TopCategory } from 'entities/catalog';

const MOBILE_CATALOG_PATH = '/mobile-catalog';

@injectable()
export class HeaderCatalogService {
	private topCategoriesRequest: Promise<TopCategory[]> | null = null;

	constructor(@inject(CatalogService) private readonly catalogService: CatalogService) {}

	// Top categories rarely change, so the first request is reused for every later menu open.
	fetchTopCategories() {
		this.topCategoriesRequest ??= this.catalogService.fetchTopCategories().then(({ data }) => data.data);
		this.topCategoriesRequest.catch(() => {
			this.topCategoriesRequest = null;
		});
		return this.topCategoriesRequest;
	}

	openMobileCatalog() {
		return Router.push(MOBILE_CATALOG_PATH);
	}
}
