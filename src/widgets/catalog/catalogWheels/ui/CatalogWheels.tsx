import { FC } from 'react';
import { CircularProgress } from '@mui/material';
import type { DefaultPage } from 'entities/page';
import { useRouter } from 'next/router';
import { Catalog, BrandCatalog } from 'widgets/catalog/ui';
import {
	useCatalogFilters,
	useCatalogData,
	useCatalogRouter,
	getWheelsFiltersConfig,
	parseRouterQuery,
	type WheelFilterValues
} from 'features/wheelsCatalog';
import { ModelCatalog } from 'widgets/catalog/ui/types';

interface Props {
	pageData: DefaultPage;
}

export const CatalogWheels: FC<Props> = ({ pageData }) => {
	const router = useRouter();
	const queryParams = parseRouterQuery(router.query);

	const { filtersValues, setFiltersValues } = useCatalogFilters(queryParams);

	const {
		wheels,
		isLoading,
		pageCount,
		total,
		brands,
		models,
		diameters,
		widths,
		numberHoles,
		diameterCenterHoles,
		diskOffsets,
		catalogCategories,
		onOpenDiameterAutocomplete,
		onOpenWidthAutocomplete,
		onOpenNumberHolesAutocomplete,
		onOpenDiameterCenterHoleAutocomplete,
		onOpenDiskOffsetAutocomplete,
		isLoadingBrands,
		isLoadingModels,
		isLoadingDiameters,
		isLoadingWidths,
		isLoadingNumberHoles,
		isLoadingDiameterCenterHoles,
		isLoadingDiskOffsets
	} = useCatalogData({ queryParams, filtersValues });

	const { handleClickFind, handleChangeSort } = useCatalogRouter();

	const handleChangeFilterValues = (values: { [key: string]: string | null }) => {
		setFiltersValues(values as WheelFilterValues);
	};

	const filtersConfig = getWheelsFiltersConfig({
		brands,
		models,
		diameters,
		widths,
		numberHoles,
		diameterCenterHoles,
		diskOffsets,
		noOptionsText: <>Совпадений нет</>,
		onOpenDiameterAutocomplete,
		onOpenWidthAutocomplete,
		onOpenNumberHolesAutocomplete,
		onOpenDiameterCenterHoleAutocomplete,
		onOpenDiskOffsetAutocomplete,
		isLoadingBrand: isLoadingBrands,
		isLoadingModel: isLoadingModels,
		isLoadingDiameter: isLoadingDiameters,
		isLoadingWidth: isLoadingWidths,
		isLoadingNumberHoles,
		isLoadingDiameterCenterHole: isLoadingDiameterCenterHoles,
		isLoadingDiskOffset: isLoadingDiskOffsets,
		loadingOptionsText: <CircularProgress size={20} />
	});

	const brandsForCatalog: BrandCatalog[] = brands.map((b) => ({
		id: b.id,
		name: b.name,
		slug: b.slug,
		path: `/wheels/${b.slug}`,
		count: b.wheels?.count
	}));

	const modelsForCatalog: ModelCatalog[] = models?.map((m) => ({
		id: m.id,
		name: m.name,
		slug: m.slug,
		path: `/wheels/${filtersValues.brand}/model-${m.slug}`,
		count: m.wheels?.count
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
			data={wheels}
			isLoading={isLoading}
			pageCount={pageCount}
			page={queryParams.page}
			sort={queryParams.sort}
			onChangeSort={handleChangeSort}
			catalogCategories={catalogCategories}
		/>
	);
};
