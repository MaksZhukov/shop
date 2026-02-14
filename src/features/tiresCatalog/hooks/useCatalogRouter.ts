import { useRouter } from 'next/router';
import type { TireFilterValues } from '../types';

export const useCatalogRouter = () => {
	const router = useRouter();

	const handleClickFind = (filtersValues: TireFilterValues) => {
		const newQuery = { ...router.query };

		newQuery['brand'] = filtersValues.brand ?? '';
		newQuery['width'] = filtersValues.width ?? '';
		newQuery['height'] = filtersValues.height ?? '';
		newQuery['diameter'] = filtersValues.diameter ?? '';
		newQuery['season'] = filtersValues.season ?? '';
		newQuery['page'] = '1';

		Object.keys(newQuery).forEach((key) => {
			if (newQuery[key] === '' || newQuery[key] == null) {
				delete newQuery[key];
			}
		});

		router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: false });
	};

	const handleChangeSort = (sort: string) => {
		const newQuery = { ...router.query, sort };
		router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true });
	};

	return {
		handleClickFind,
		handleChangeSort
	};
};
