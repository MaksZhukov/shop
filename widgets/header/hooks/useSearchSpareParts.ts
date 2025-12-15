import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from 'rooks';
import { sparePartApi } from 'entities/sparePart';

export const useSearchSpareParts = (searchValue: string) => {
	const [debouncedSearchValue] = useDebouncedValue(searchValue, 300);

	const { data: searchedSpareParts, isFetching } = useQuery({
		queryKey: ['spareParts', debouncedSearchValue],
		enabled: debouncedSearchValue.length > 2,
		placeholderData: (prev) => prev,
		queryFn: () =>
			sparePartApi.fetchSpareParts({
				pagination: { limit: 10 },
				populate: ['brand'],
				filters: { h1: { $contains: debouncedSearchValue } }
			})
	});

	return { searchedSpareParts, isFetching };
};
