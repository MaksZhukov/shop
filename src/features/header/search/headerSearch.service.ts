import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import Router from 'next/router';
import { SparePartService, type SparePart } from 'entities/sparePart';
import type { Filters } from 'shared/api/types';
import { MAX_SEARCH_HISTORY_LENGTH, SEARCH_EXAMPLE, SEARCH_RESULTS_LIMIT } from './search.constants';
import { HEADER_CATALOG_FILTERS, type HeaderCatalogFilters } from '../ports/header.port';
import { searchHistoryLocalStorage } from './searchHistoryLocalStorage';

@injectable()
export class HeaderSearchService {
	constructor(
		@inject(SparePartService) private readonly sparePartService: SparePartService,
		@inject(HEADER_CATALOG_FILTERS) private readonly catalogFilters: HeaderCatalogFilters
	) {}

	// Read synchronously inside a computed, so the search reruns when catalog filters change.
	getSearchFilters(): Filters {
		return this.catalogFilters.getFilters();
	}

	async searchSpareParts(query: string, filters: Filters): Promise<SparePart[]> {
		const { data } = await this.sparePartService.fetchSpareParts({
			pagination: { limit: SEARCH_RESULTS_LIMIT },
			populate: ['brand'],
			filters: { h1: { $contains: query }, sold: false, ...filters }
		});
		return data.data;
	}

	async fetchSparePartsTotal(): Promise<number | undefined> {
		const { data } = await this.sparePartService.fetchSpareParts({
			pagination: { limit: 0 },
			filters: { sold: false }
		});
		return data.meta?.pagination?.total;
	}

	getSearchPlaceholder(total?: number) {
		const count = total != null ? total.toLocaleString('ru-RU') : '…';
		return `Найти среди ${count} автозапчастей. Например: ${SEARCH_EXAMPLE}`;
	}

	loadSearchHistory() {
		return searchHistoryLocalStorage.getSearchHistory();
	}

	saveSearchHistory(history: string[]) {
		searchHistoryLocalStorage.setSearchHistory(history);
	}

	addToSearchHistory(history: string[], value: string) {
		return [...new Set([value, ...history])].slice(0, MAX_SEARCH_HISTORY_LENGTH);
	}

	openSparePart(item: SparePart) {
		return Router.push(`/spare-parts/${item.brand?.slug}/${item.slug}`);
	}
}
