import { useRouter } from 'next/router';
import type { FilterValues } from '../types';

export const useCatalogRouter = () => {
	const router = useRouter();

	const handleClickFind = (filtersValues: FilterValues) => {
		const slug: string[] = [];
		const {
			brand: brandValue,
			model: modelValue,
			generation: generationValue,
			kindSparePart: kindSparePartValue,
			...restFiltersValues
		} = filtersValues;

		if (brandValue) {
			slug.push(brandValue);
		}
		if (modelValue) {
			slug.push('model-' + modelValue);
		}
		if (generationValue) {
			slug.push('gen-' + generationValue);
		}
		if (kindSparePartValue) {
			slug.push('ksp-' + kindSparePartValue);
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
