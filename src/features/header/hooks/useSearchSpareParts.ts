import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from 'rooks';
import { SparePartService } from 'entities/sparePart';
import type { Filters } from 'shared/api/types';
import { inject } from '../header.di';
import { useRouter } from 'next/router';
export const useSearchSpareParts = (searchValue: string, catalogFilters: Filters) => {
	const [debouncedSearchValue] = useDebouncedValue(searchValue, 300);
	const router = useRouter();
	const sparePartService = inject(SparePartService);
	const isSparePartsPage = router.pathname.startsWith('/spare-parts');

	const { data: searchedSpareParts, isFetching } = useQuery({
		queryKey: ['spareParts', debouncedSearchValue, isSparePartsPage ? catalogFilters : null],
		enabled: debouncedSearchValue.length > 2,
		placeholderData: (prev) => prev,
		queryFn: () =>
			sparePartService.fetchSpareParts({
				pagination: { limit: 10 },
				populate: ['brand'],
				filters: {
					h1: { $contains: debouncedSearchValue },
					sold: false,
					...(isSparePartsPage ? catalogFilters : {})
				}
			})
	});

	return { searchedSpareParts, isFetching };
};
