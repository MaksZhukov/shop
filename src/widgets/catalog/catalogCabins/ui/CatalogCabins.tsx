import { CircularProgress } from '@mui/material';
import { FC } from 'react';
import type { BrandWithCabinsCount } from 'entities/brand/brandTypes';
import type { KindSparePart } from 'entities/kindSparePart';
import type { DefaultPage } from 'entities/page';
import { useRouter } from 'next/router';
import { BrandCatalog, Catalog } from 'widgets/catalog/ui';
import {
	useCabinsCatalogFilters,
	useCabinsCatalogData,
	useCabinsAutocompleteHandlers,
	useCabinsCatalogRouter,
	getCabinsFiltersConfig,
	parseCabinsRouterQuery,
	type CabinsFilterValues
} from 'features/cabinsCatalog';
import { ModelCatalog } from 'widgets/catalog/ui/types';

interface Props {
	kindSparePart?: KindSparePart;
	pageData: DefaultPage;
}

export const CatalogCabins: FC<Props> = ({ kindSparePart, pageData }) => {
	const router = useRouter();
	const queryParams = parseCabinsRouterQuery(router.query);

	const { filtersValues, setFiltersValues } = useCabinsCatalogFilters(queryParams);
	const { cabins, isLoading, pageCount, total, models, setModels, brands, generations, setGenerations } =
		useCabinsCatalogData({ queryParams, filtersValues });

	const {
		kindSpareParts,
		isLoading: isLoadingAutocomplete,
		isLoadingMore,
		handleOpenAutocompleteGeneration,
		handleOpenAutocompleteKindSparePart,
		handleInputChangeKindSparePart,
		handleScrollKindSparePartAutocomplete,
		handleChangeBrandAutocomplete,
		handleChangeModelAutocomplete,
		setIsReloadKindSpareParts
	} = useCabinsAutocompleteHandlers({
		generations,
		setGenerations,
		filtersValues,
		kindSparePart,
		onBrandChange: () => {
			setModels([]);
			setGenerations([]);
		},
		onModelChange: () => {
			setGenerations([]);
		}
	});

	const { handleClickFind, handleChangeSort } = useCabinsCatalogRouter();

	const handleChangeFilterValues = (values: { [key: string]: string | null }) => {
		const newValues = values as CabinsFilterValues;
		let newFilterValues = newValues;

		if (!newValues.brand) {
			newFilterValues = { ...newFilterValues, model: null, generation: null };
			setModels([]);
			setGenerations([]);
		}

		if (!newValues.model) {
			newFilterValues = { ...newFilterValues, generation: null };
			setGenerations([]);
		}

		if (
			filtersValues.brand !== newFilterValues.brand ||
			filtersValues.model !== newFilterValues.model ||
			filtersValues.generation !== newFilterValues.generation
		) {
			setIsReloadKindSpareParts(true);
		}

		setFiltersValues(newFilterValues);
	};

	const noOptionsText = isLoadingAutocomplete ? <CircularProgress size={20} /> : <>Совпадений нет</>;

	const filtersConfig = getCabinsFiltersConfig({
		brands,
		models,
		kindSpareParts,
		generations,
		noOptionsText,
		isLoadingMoreKindSpareParts: isLoadingMore,
		onChangeBrandAutocomplete: handleChangeBrandAutocomplete,
		onChangeModelAutocomplete: handleChangeModelAutocomplete,
		onOpenAutocompleteGeneration: handleOpenAutocompleteGeneration,
		onOpenAutoCompleteKindSparePart: handleOpenAutocompleteKindSparePart,
		onScrollKindSparePartAutocomplete: handleScrollKindSparePartAutocomplete,
		onInputChangeKindSparePart: handleInputChangeKindSparePart
	});

	const generateQueryParams = () => {
		const { brand, model, generation, ...restFiltersValues } = filtersValues;

		const newQuery: Record<string, string> = {};

		Object.keys(restFiltersValues).forEach((key) => {
			if (restFiltersValues[key as keyof typeof restFiltersValues]) {
				newQuery[key] = restFiltersValues[key as keyof typeof restFiltersValues] as string;
			} else {
				delete newQuery[key];
			}
		});

		const queryString = new URLSearchParams(newQuery).toString();

		return queryString ? `?${queryString}` : '';
	};

	const brandsForCatalog: BrandCatalog[] = brands.map((b) => ({
		id: b.id,
		name: b.name,
		slug: b.slug,
		path: `/cabins/${b.slug}${generateQueryParams()}`,
		count: b.cabins.count
	}));

	const modelsForCatalog: ModelCatalog[] = models?.map((m) => ({
		id: m.id,
		name: m.name,
		slug: m.slug,
		path: `/cabins/${filtersValues.brand}/model-${m.slug}${generateQueryParams()}`,
		count: m.cabins?.count,
		generations: m.generations
			.filter((g) => g.cabins?.count)
			.map((g) => ({
				id: g.id,
				name: g.name,
				slug: g.slug,
				path: `/cabins/${filtersValues.brand}/model-${m.slug}/${g.slug}${generateQueryParams()}`,
				count: g.cabins.count
			}))
	}));

	return (
		<Catalog
			brands={brandsForCatalog}
			models={modelsForCatalog}
			filtersValues={filtersValues}
			onChangeFilterValues={handleChangeFilterValues}
			filtersConfig={filtersConfig}
			seo={pageData.seo}
			total={total}
			onClickFind={() => handleClickFind(filtersValues)}
			data={cabins}
			isLoading={isLoading}
			pageCount={pageCount}
			page={queryParams.page}
			sort={queryParams.sort}
			onChangeSort={handleChangeSort}
		/>
	);
};
