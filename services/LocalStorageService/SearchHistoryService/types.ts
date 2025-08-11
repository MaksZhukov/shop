export interface SearchHistoryStorage {
	searchHistory: string[];
}

export interface SearchSuggestion {
	term: string;
	relevance: number;
}
