import { useRouter } from 'next/router';
import type { TireFilterValues } from '../types';

export const useCatalogRouter = () => {
	const router = useRouter();

	const handleClickFind = (filtersValues: TireFilterValues) => {
		const newQuery = { ...router.query };

		const brand = filtersValues.brand ?? '';
		newQuery['width'] = filtersValues.width ?? '';
		newQuery['height'] = filtersValues.height ?? '';
		newQuery['diameter'] = filtersValues.diameter ?? '';
		newQuery['season'] = filtersValues.season ?? '';

		if (brand) {
			delete newQuery['brand'];
		} else {
			newQuery['brand'] = '';
		}

		Object.keys(newQuery).forEach((key) => {
			if (newQuery[key] === '' || newQuery[key] == null) {
				delete newQuery[key];
			}
		});

		delete newQuery['page'];

		const pathname = brand ? `/tires/${encodeURIComponent(brand)}` : '/tires';
		router.push({ pathname, query: newQuery }, undefined, { shallow: false });
	};

	const handleChangeSort = (sort: string) => {
		const newQuery: Record<string, string | string[] | undefined> = { ...router.query, sort };
		delete newQuery['slug'];
		const brandFromPath = Array.isArray(router.query.slug) ? router.query.slug[0] : undefined;
		const pathname = brandFromPath ? `/tires/${encodeURIComponent(brandFromPath)}` : '/tires';
		router.push({ pathname, query: newQuery }, undefined, { shallow: true });
	};

	return {
		handleClickFind,
		handleChangeSort
	};
};
