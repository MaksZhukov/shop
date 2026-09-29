import 'reflect-metadata';
import { atom, computed, reatomBoolean, sleep, withAsyncData, wrap } from '@reatom/core';
import { inject, injectable } from 'inversify';
import type { SparePart } from 'entities/sparePart';
import { SEARCH_DEBOUNCE_MS, SEARCH_MIN_LENGTH } from './search.constants';
import { HeaderSearchService } from './headerSearch.service';

@injectable()
export class HeaderSearchStore {
	readonly searchValue = atom('', 'headerSearch.value');
	readonly searchHistory = atom(() => this.headerSearchService.loadSearchHistory(), 'headerSearch.history');
	readonly isDropdownOpened = reatomBoolean(false, 'headerSearch.isDropdownOpened');

	readonly hasQuery = computed(() => this.searchValue().length >= SEARCH_MIN_LENGTH, 'headerSearch.hasQuery');

	readonly searchResults = computed(async () => {
		const query = this.searchValue();
		const filters = this.headerSearchService.getSearchFilters();
		if (!this.hasQuery()) {
			return [];
		}
		await wrap(sleep(SEARCH_DEBOUNCE_MS));
		return await wrap(this.headerSearchService.searchSpareParts(query, filters));
	}, 'headerSearch.results').extend(withAsyncData({ initState: [] as SparePart[] }));

	readonly sparePartsTotal = computed(async () => {
		return await wrap(this.headerSearchService.fetchSparePartsTotal());
	}, 'headerSearch.sparePartsTotal').extend(withAsyncData({ initState: undefined as number | undefined }));

	readonly placeholder = computed(
		() => this.headerSearchService.getSearchPlaceholder(this.sparePartsTotal.data()),
		'headerSearch.placeholder'
	);

	constructor(@inject(HeaderSearchService) private readonly headerSearchService: HeaderSearchService) {}

	changeSearchValue(value: string) {
		this.searchValue.set(value);
		this.isDropdownOpened.set(this.hasQuery());
	}

	focus() {
		if (this.hasQuery()) {
			this.isDropdownOpened.setTrue();
		}
	}

	selectSearchResult(item: SparePart) {
		this.updateSearchHistory(
			this.headerSearchService.addToSearchHistory(this.searchHistory(), this.searchValue())
		);
		this.searchValue.set('');
		this.isDropdownOpened.setFalse();
		this.headerSearchService.openSparePart(item);
	}

	deleteSearchHistory(value: string) {
		this.updateSearchHistory(this.searchHistory().filter((item) => item !== value));
	}

	clearSearchHistory() {
		this.updateSearchHistory([]);
	}

	private updateSearchHistory(history: string[]) {
		this.searchHistory.set(history);
		this.headerSearchService.saveSearchHistory(history);
	}
}
