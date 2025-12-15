import { useRouter } from 'next/router';
import { FilterValues } from '../types';

export const useCatalogRouter = () => {
	const router = useRouter();

	const handleClickFind = (filtersValues: FilterValues) => {
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

		Object.keys(restFiltersValues).forEach((key) => {
			if (restFiltersValues[key as keyof typeof restFiltersValues]) {
				router.query[key] = restFiltersValues[key as keyof typeof restFiltersValues] as string;
			} else {
				delete router.query[key];
			}
		});

		router.query['slug'] = slug;
		router.query['page'] = '1';

		router.push({ pathname: router.pathname, query: router.query }, undefined, { shallow: false });
	};

	const handleChangeSort = (sort: string) => {
		router.query.sort = sort;
		router.push({ pathname: router.pathname, query: router.query });
	};

	return {
		handleClickFind,
		handleChangeSort
	};
};

