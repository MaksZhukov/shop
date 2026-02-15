import { FC } from 'react';
import { CircularProgress } from '@mui/material';
import type { DefaultPage } from 'entities/page';
import { useRouter } from 'next/router';
import { BrandCatalog, Catalog } from 'widgets/catalog/ui';
import {
	useCatalogFilters,
	useCatalogData,
	useCatalogRouter,
	getTiresFiltersConfig,
	parseRouterQuery,
	type TireFilterValues
} from 'features/tiresCatalog';

interface Props {
	pageData: DefaultPage;
}

export const CatalogTires: FC<Props> = ({ pageData }) => {
	const router = useRouter();
	const queryParams = parseRouterQuery(router.query);

	const { filtersValues, setFiltersValues } = useCatalogFilters(queryParams);
	const {
		tires,
		isLoading,
		pageCount,
		total,
		tireBrands,
		widths,
		heights,
		diameters,
		catalogCategories,
		onOpenWidthAutocomplete,
		onOpenHeightAutocomplete,
		onOpenDiameterAutocomplete,
		isLoadingBrands,
		isLoadingWidths,
		isLoadingHeights,
		isLoadingDiameters
	} = useCatalogData({ queryParams, filtersValues });

	const { handleClickFind, handleChangeSort } = useCatalogRouter();

	const handleChangeFilterValues = (values: { [key: string]: string | null }) => {
		setFiltersValues(values as TireFilterValues);
	};

	const filtersConfig = getTiresFiltersConfig({
		tireBrands,
		widths,
		heights,
		diameters,
		noOptionsText: <>Совпадений нет</>,
		onOpenWidthAutocomplete,
		onOpenHeightAutocomplete,
		onOpenDiameterAutocomplete,
		isLoadingBrand: isLoadingBrands,
		isLoadingWidth: isLoadingWidths,
		isLoadingHeight: isLoadingHeights,
		isLoadingDiameter: isLoadingDiameters,
		loadingOptionsText: <CircularProgress size={20} />
	});

	const brandsForCatalog: BrandCatalog[] = tireBrands.map((b) => ({
		id: b.id,
		name: b.name,
		slug: b.slug,
		path: `/tires/${b.slug}`,
		count: b.tires.count
	}));

	return (
		<Catalog
			brands={brandsForCatalog}
			filtersValues={filtersValues}
			onChangeFilterValues={handleChangeFilterValues}
			filtersConfig={filtersConfig}
			seo={pageData.seo}
			total={total}
			onClickFind={() => handleClickFind(filtersValues)}
			data={tires}
			isLoading={isLoading}
			pageCount={pageCount}
			page={queryParams.page}
			sort={queryParams.sort}
			onChangeSort={handleChangeSort}
			catalogCategories={catalogCategories}
		/>
	);
};
