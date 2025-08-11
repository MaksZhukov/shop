import { BaseStorageService } from '../BaseStorageService';

export class SearchHistoryService extends BaseStorageService {
	private readonly SEARCH_HISTORY_KEY = 'searchHistory';

	getSearchHistory(): string[] {
		return this.getItem(this.SEARCH_HISTORY_KEY, []);
	}

	setSearchHistory(history: string[]): void {
		this.setItem(this.SEARCH_HISTORY_KEY, history);
	}
}
