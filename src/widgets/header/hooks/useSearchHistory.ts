import { useEffect, useState } from 'react';
import { searchHistoryLocalStorage } from '../searchHistoryLocalStorage';
import { MAX_SEARCH_HISTORY_LENGTH } from '../headerConstants';

export const useSearchHistory = () => {
	const [searchHistory, setSearchHistory] = useState<string[]>(searchHistoryLocalStorage.getSearchHistory());

	useEffect(() => {
		searchHistoryLocalStorage.setSearchHistory(searchHistory);
	}, [searchHistory]);

	const deleteSearchHistory = (value: string) => {
		const newSearchHistory = searchHistory.filter((item) => item !== value);
		setSearchHistory(newSearchHistory);
	};

	const addToSearchHistory = (value: string) => {
		const newSearchHistory = [...new Set([value, ...searchHistory])].slice(0, MAX_SEARCH_HISTORY_LENGTH);
		setSearchHistory(newSearchHistory);
	};

	const clearSearchHistory = () => {
		setSearchHistory([]);
	};

	return {
		searchHistory,
		setSearchHistory,
		deleteSearchHistory,
		addToSearchHistory,
		clearSearchHistory
	};
};
