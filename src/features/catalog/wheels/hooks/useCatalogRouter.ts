import { useRouter } from 'next/router';
import type { WheelFilterValues } from '../types';

export const useCatalogRouter = () => {
	const router = useRouter();

	const handleClickFind = (filtersValues: WheelFilterValues) => {
		const newQuery = { ...router.query };

		const brand = filtersValues.brand ?? '';
		const model = filtersValues.model ?? '';
		newQuery['kind'] = filtersValues.kind ?? '';
		newQuery['width'] = filtersValues.width ?? '';
		newQuery['diameter'] = filtersValues.diameter ?? '';
		newQuery['numberHoles'] = filtersValues.numberHoles ?? '';
		newQuery['diameterCenterHole'] = filtersValues.diameterCenterHole ?? '';
		newQuery['distanceBetweenCenters'] = filtersValues.distanceBetweenCenters ?? '';
		newQuery['diskOffset'] = filtersValues.diskOffset ?? '';
		delete newQuery['page'];
		delete newQuery['brand'];
		delete newQuery['model'];

		Object.keys(newQuery).forEach((key) => {
			if (newQuery[key] === '' || newQuery[key] == null) {
				delete newQuery[key];
			}
		});

		const slug: string[] = [];
		if (brand) slug.push(brand);
		if (model) slug.push(`model-${model}`);
		const pathname = slug.length ? `/wheels/${slug.map((s) => encodeURIComponent(s)).join('/')}` : '/wheels';
		router.push({ pathname, query: newQuery }, undefined, { shallow: false });
	};

	const handleChangeSort = (sort: string) => {
		const newQuery: Record<string, string | string[] | undefined> = { ...router.query, sort };
		delete newQuery['slug'];
		const slug = router.query.slug;
		const slugArr = Array.isArray(slug) ? slug : slug ? [slug] : [];
		const pathname =
			slugArr.length > 0 ? `/wheels/${slugArr.map((s) => encodeURIComponent(s)).join('/')}` : '/wheels';
		router.push({ pathname, query: newQuery }, undefined, { shallow: true });
	};

	return {
		handleClickFind,
		handleChangeSort
	};
};
