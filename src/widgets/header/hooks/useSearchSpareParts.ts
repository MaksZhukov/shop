import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from 'rooks';
import { sparePartApi } from 'entities/sparePart';
import { useRouter } from 'next/router';
import { useSparePartsCatalogFiltersStore, generateFiltersByQuery } from 'features/sparePartsCatalog';

export const useSearchSpareParts = (searchValue: string) => {
	const [debouncedSearchValue] = useDebouncedValue(searchValue, 300);
	const router = useRouter();
	const { filtersValues } = useSparePartsCatalogFiltersStore();
	const isSparePartsPage = router.pathname.startsWith('/spare-parts');

	const catalogFilters = isSparePartsPage ? generateFiltersByQuery(filtersValues) : {};

	const { data: searchedSpareParts, isFetching } = useQuery({
		queryKey: ['spareParts', debouncedSearchValue, isSparePartsPage ? filtersValues : null],
		enabled: debouncedSearchValue.length > 2,
		placeholderData: (prev) => prev,
		queryFn: () =>
			sparePartApi.fetchSpareParts({
				pagination: { limit: 10 },
				populate: ['brand'],
				filters: {
					h1: { $contains: debouncedSearchValue },
					sold: false,
					...catalogFilters
				}
			})
	});

	return { searchedSpareParts, isFetching };
};
