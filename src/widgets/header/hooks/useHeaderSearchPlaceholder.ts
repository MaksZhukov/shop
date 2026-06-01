import { useQuery } from '@tanstack/react-query';
import { mainPageQueryFns, mainPageQueryKeys } from 'features/mainPage';

const SEARCH_EXAMPLE = 'Volvo S80';

export const getHeaderSearchPlaceholder = (total?: number) => {
	const count = total != null ? total.toLocaleString('ru-RU') : '…';

	return `Найти среди ${count} автозапчастей. Например: ${SEARCH_EXAMPLE}`;
};

export const useHeaderSearchPlaceholder = () => {
	const { data: total } = useQuery({
		queryKey: mainPageQueryKeys.sparePartsTotal(),
		queryFn: mainPageQueryFns.sparePartsTotal,
		select: (response) => response.meta?.pagination?.total
	});

	return getHeaderSearchPlaceholder(total);
};
