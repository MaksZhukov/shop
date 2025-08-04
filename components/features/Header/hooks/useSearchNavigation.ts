import router from 'next/router';
import { SparePart } from 'api/spareParts/types';

export const useSearchNavigation = (addToSearchHistory: (value: string) => void) => {
	const handleSearchSelect = (item: SparePart, searchValue: string) => {
		addToSearchHistory(searchValue);
		router.push(`/spare-parts/${item.brand?.slug}/${item.slug}`);
	};

	return {
		handleSearchSelect
	};
};
