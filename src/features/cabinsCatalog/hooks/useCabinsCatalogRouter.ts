import { useRouter } from 'next/router';
import type { CabinsFilterValues } from '../types';

export const useCabinsCatalogRouter = () => {
	const router = useRouter();

	const handleClickFind = (filtersValues: CabinsFilterValues) => {
		const slug: string[] = [];
		const {
			brand: brandValue,
			model: modelValue,
			generation: generationValue,
			...restFiltersValues
		} = filtersValues;

		if (brandValue) {
			slug.push(brandValue);
		}
		if (modelValue) {
			slug.push('model-' + modelValue);
		}
		if (generationValue) {
			slug.push(generationValue);
		}

		const newQuery = { ...router.query };

		Object.keys(restFiltersValues).forEach((key) => {
			if (restFiltersValues[key as keyof typeof restFiltersValues]) {
				newQuery[key] = restFiltersValues[key as keyof typeof restFiltersValues] as string;
			} else {
				delete newQuery[key];
			}
		});

		newQuery['slug'] = slug;
		delete newQuery['page'];

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
