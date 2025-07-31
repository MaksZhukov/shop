import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from 'rooks';
import { fetchSpareParts } from 'api/spareParts/spareParts';

export const useSearchSpareParts = (searchValue: string) => {
	const [debouncedSearchValue] = useDebouncedValue(searchValue, 300);

	const { data: searchedSpareParts, isFetching } = useQuery({
		queryKey: ['spareParts', debouncedSearchValue],
		enabled: debouncedSearchValue.length > 2,
		placeholderData: (prev) => prev,
		queryFn: () =>
			fetchSpareParts({
				pagination: { limit: 10 },
				filters: { h1: { $contains: debouncedSearchValue } }
			})
	});

	return { searchedSpareParts, isFetching };
};
