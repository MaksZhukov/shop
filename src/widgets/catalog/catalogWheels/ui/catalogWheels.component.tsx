import { FC } from 'react';
import { CircularProgress } from '@mui/material';
import type { BrandWithWheelsCount } from 'entities/brand';
import type { DefaultPage } from 'entities/page';
import { useRouter } from 'next/router';
import { Catalog, mapToCatalogReferences } from 'widgets/catalog/ui';
import type { CatalogReference } from 'widgets/catalog/ui';
import {
	useCatalogFilters,
	useCatalogData,
	useCatalogRouter,
	getWheelsFiltersConfig,
	parseRouterQuery,
	type WheelFilterValues
} from 'features/wheelsCatalog';

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

	const references: CatalogReference[] = (() => {
		if (!filtersValues.brand) {
			return mapToCatalogReferences(
				brands.map((b) => ({
					id: b.id,
					name: b.name,
					path: `/wheels/${b.slug}${generateQueryParams()}`,
					count: b.wheels?.count ?? 0
				}))
			);
		}

		if (!filtersValues.model) {
			return mapToCatalogReferences(
				models.map((m) => ({
					id: m.id,
					name: m.name,
					path: `/wheels/${filtersValues.brand}/model-${m.slug}${generateQueryParams()}`,
					count: m.wheels?.count
				}))
			);
		}

		return [];
	})();

	const showReferencesPanel = !filtersValues.brand || (!filtersValues.model && references.length > 0);

	return (
		<Catalog
			references={references}
			showReferencesPanel={showReferencesPanel}
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
