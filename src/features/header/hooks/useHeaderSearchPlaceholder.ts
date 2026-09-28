const SEARCH_EXAMPLE = 'Volvo S80';

export const getHeaderSearchPlaceholder = (total?: number) => {
	const count = total != null ? total.toLocaleString('ru-RU') : '…';

	return `Найти среди ${count} автозапчастей. Например: ${SEARCH_EXAMPLE}`;
};

