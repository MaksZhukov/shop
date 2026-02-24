import { CircularProgress } from '@mui/material';
import { FC } from 'react';
import { observer } from 'mobx-react';
import type { KindSparePart } from 'entities/kindSparePart';
import type { DefaultPage } from 'entities/page';
import { useRouter } from 'next/router';
import { BrandCatalog, Catalog } from 'widgets/catalog/ui';
import {
	useSparePartsCatalogFiltersStore,
	useCatalogData,
	useAutocompleteHandlers,
	useCatalogRouter,
	getSparePartsFiltersConfig,
	parseRouterQuery,
	FilterValues,
	useSyncSparePartsCatalogFiltersFromRouter
} from 'features/sparePartsCatalog';
import type { KindSparePartType } from 'entities/kindSparePart';
import { ModelCatalog } from 'widgets/catalog/ui/types';

interface Props {
	kindSparePart?: KindSparePart;
	kindSparePartType?: KindSparePartType;
	pageData: DefaultPage;
}

export const CatalogSpareParts: FC<Props> = observer(({ kindSparePart, kindSparePartType = 'regular', pageData }) => {
	const router = useRouter();
	const queryParams = parseRouterQuery(router.query);

	const sparePartsCatalogFiltersStore = useSparePartsCatalogFiltersStore();
	const filtersValues = sparePartsCatalogFiltersStore.filtersValues;
	useSyncSparePartsCatalogFiltersFromRouter();
	const {
		spareParts,
		isLoading,
		pageCount,
		total,
		models,
		setModels,
		generations,
		setGenerations,
		volumes,
		setVolumes,
		catalogCategories,
		hoveredCategory,
		setHoveredCategory,
		brands
	} = useCatalogData({ queryParams, filtersValues });

	const {
		kindSpareParts,
		isLoading: isLoadingAutocomplete,
		isLoadingMore,
		handleOpenAutocompleteGeneration,
		handleOpenAutocompleteKindSparePart,
		handleOpenAutocompleteVolume,
		handleInputChangeKindSparePart,
		handleScrollKindSparePartAutocomplete,
		handleChangeBrandAutocomplete,
		handleChangeModelAutocomplete,
		setIsReloadKindSpareParts
	} = useAutocompleteHandlers({
		generations,
		setGenerations,
		volumes,
		setVolumes,
		filtersValues,
		kindSparePart,
		kindSparePartType,
		onBrandChange: () => {
			setModels([]);
			setGenerations([]);
		},
		onModelChange: () => {
			setGenerations([]);
		}
	});

	const { handleClickFind, handleChangeSort } = useCatalogRouter();

	const handleChangeFilterValues = (values: { [key: string]: string | null }) => {
		const newValues = values as FilterValues;
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
		sparePartsCatalogFiltersStore.setFiltersValues(newFilterValues);
	};

	const noOptionsText = isLoadingAutocomplete ? <CircularProgress size={20} /> : <>Совпадений нет</>;

	const filtersConfig = getSparePartsFiltersConfig({
		brands,
		models,
		kindSpareParts,
		generations,
		noOptionsText,
		volumes,
		isLoadingMoreKindSpareParts: isLoadingMore,
		onChangeBrandAutocomplete: handleChangeBrandAutocomplete,
		onChangeModelAutocomplete: handleChangeModelAutocomplete,
		onOpenAutocompleteGeneration: handleOpenAutocompleteGeneration,
		onOpenAutoCompleteKindSparePart: handleOpenAutocompleteKindSparePart,
		onScrollKindSparePartAutocomplete: handleScrollKindSparePartAutocomplete,
		onInputChangeKindSparePart: handleInputChangeKindSparePart,
		onOpenAutoCompleteVolume: handleOpenAutocompleteVolume
	});

	const generateQueryParams = () => {
		const { brand, model, generation, kindSparePart, ...restFiltersValues } = filtersValues;

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

	const generateSparePartsPath = (...segments: string[]) => {
		const pathBase = `/spare-parts/${segments.join('/')}`;
		const ksp = filtersValues.kindSparePart ? `/ksp-${filtersValues.kindSparePart}` : '';
		return `${pathBase}${ksp}${generateQueryParams()}`;
	};

	const brandsForCatalog: BrandCatalog[] = brands.map((b) => ({
		id: b.id,
		name: b.name,
		slug: b.slug,
		path: generateSparePartsPath(b.slug),
		count: b.spareParts.count
	}));

	const modelsForCatalog: ModelCatalog[] = models?.map((m) => ({
		id: m.id,
		name: m.name,
		slug: m.slug,
		path: generateSparePartsPath(filtersValues.brand!, `model-${m.slug}`),
		count: m.spareParts?.count,
		generations: m.generations.map((g) => ({
			id: g.id,
			name: g.name,
			slug: g.slug,
			path: generateSparePartsPath(filtersValues.brand!, `model-${m.slug}`, `gen-${g.slug}`),
			count: g.spareParts?.count
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
			data={spareParts}
			isLoading={isLoading}
			pageCount={pageCount}
			page={queryParams.page}
			sort={queryParams.sort}
			onChangeSort={handleChangeSort}
			catalogCategories={catalogCategories}
			hoveredCategory={hoveredCategory}
			onChangeHoveredCategory={setHoveredCategory}
		/>
	);
});
