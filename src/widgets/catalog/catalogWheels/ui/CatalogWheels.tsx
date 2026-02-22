import { FC } from 'react';
import { CircularProgress } from '@mui/material';
import type { BrandWithWheelsCount } from 'entities/brand';
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
		isLoadingModels,
		isLoadingDiameters,
		isLoadingWidths,
		isLoadingNumberHoles,
		isLoadingDiameterCenterHoles,
		isLoadingDiskOffsets,
		brands
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
		isLoadingBrand: false,
		isLoadingModel: isLoadingModels,
		isLoadingDiameter: isLoadingDiameters,
		isLoadingWidth: isLoadingWidths,
		isLoadingNumberHoles,
		isLoadingDiameterCenterHole: isLoadingDiameterCenterHoles,
		isLoadingDiskOffset: isLoadingDiskOffsets,
		loadingOptionsText: <CircularProgress size={20} />
	});

	const generateQueryParams = () => {
		const { brand, model, ...restFiltersValues } = filtersValues;

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
		path: `/wheels/${b.slug}${generateQueryParams()}`,
		count: b.wheels?.count ?? 0
	}));

	const modelsForCatalog: ModelCatalog[] = models?.map((m) => ({
		id: m.id,
		name: m.name,
		slug: m.slug,
		path: `/wheels/${filtersValues.brand}/model-${m.slug}${generateQueryParams()}`,
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
