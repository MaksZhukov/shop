import { CircularProgress } from '@mui/material';
import { FC } from 'react';
import type { BrandWithSparePartsCount } from 'entities/brand/brandTypes';
import type { KindSparePart } from 'entities/kindSparePart';
import type { DefaultPage } from 'entities/page';
import { useRouter } from 'next/router';
import { BrandCatalog, Catalog } from 'widgets/catalog/ui';
import {
	useCatalogFilters,
	useCatalogData,
	useAutocompleteHandlers,
	useCatalogRouter,
	getSparePartsFiltersConfig,
	parseRouterQuery,
	FilterValues
} from 'features/sparePartsCatalog';
import type { KindSparePartType } from 'entities/kindSparePart';
import { ModelCatalog } from 'widgets/catalog/ui/types';

interface Props {
	brands: BrandWithSparePartsCount[];
	kindSparePart?: KindSparePart;
	kindSparePartType?: KindSparePartType;
	pageData: DefaultPage;
}

export const CatalogSpareParts: FC<Props> = ({
	brands = [],
	kindSparePart,
	kindSparePartType = 'regular',
	pageData
}) => {
	const router = useRouter();
	const queryParams = parseRouterQuery(router.query);

	const { filtersValues, setFiltersValues } = useCatalogFilters(queryParams);
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
		setHoveredCategory
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
		setFiltersValues(newFilterValues);
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

	const brandsForCatalog: BrandCatalog[] = brands.map((b) => ({
		id: b.id,
		name: b.name,
		slug: b.slug,
		path: `/spare-parts/${b.slug}`,
		count: b.spareParts.count
	}));

	const modelsForCatalog: ModelCatalog[] = models?.map((m) => ({
		id: m.id,
		name: m.name,
		slug: m.slug,
		path: `/spare-parts/${filtersValues.brand}/model-${m.slug}`,
		count: m.spareParts?.count,
		generations: m.generations
			.filter((g) => g.spareParts?.count)
			.map((g) => ({
				id: g.id,
				name: g.name,
				slug: g.slug,
				path: `/spare-parts/${filtersValues.brand}/model-${m.slug}/${g.slug}`,
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
};
