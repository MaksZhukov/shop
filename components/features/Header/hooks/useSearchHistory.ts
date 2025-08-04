import { useState } from 'react';
import { getSearchHistory, saveSearchHistory } from 'services/LocalStorageService';
import { MAX_SEARCH_HISTORY_LENGTH } from '../constants';

export const useSearchHistory = () => {
	const [searchHistory, setSearchHistory] = useState<string[]>(getSearchHistory());

	const deleteSearchHistory = (value: string) => {
		const newSearchHistory = searchHistory.filter((item) => item !== value);
		setSearchHistory(newSearchHistory);
		saveSearchHistory(newSearchHistory);
	};

	const addToSearchHistory = (value: string) => {
		const newSearchHistory = [...new Set([value, ...searchHistory])].slice(0, MAX_SEARCH_HISTORY_LENGTH);
		setSearchHistory(newSearchHistory);
		saveSearchHistory(newSearchHistory);
	};

	const clearSearchHistory = () => {
		setSearchHistory([]);
		saveSearchHistory([]);
	};

	return {
		searchHistory,
		setSearchHistory,
		deleteSearchHistory,
		addToSearchHistory,
		clearSearchHistory
	};
};
