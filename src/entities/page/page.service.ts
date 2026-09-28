import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { PAGE_API, PageApi } from './page.api';
import type { PageReader } from './ports/page.port';
import type { CollectionParams } from 'shared/api/types';
import type { DefaultPage } from './model/page.model';

@injectable()
export class PageService implements PageReader {
	constructor(@inject(PAGE_API) private readonly pageApi: PageApi) {}

	fetchPage<T = DefaultPage>(pageUrl: string, params: CollectionParams = { populate: 'seo.images' }) {
		return this.pageApi.fetchPage<T>(pageUrl, params);
	}
}
