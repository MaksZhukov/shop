import { Box } from '@mui/material';
import type { SEO } from 'shared/api/types';
import type { Product } from 'entities/product';
import { AutocompleteType, NumberType } from 'features/productFilters';
import type { TopCategory } from 'entities/catalog';
import { useState } from 'react';
import { CatalogHeader } from './CatalogHeader';
import { CatalogSidebar } from './CatalogSidebar';
import type { BrandCatalog, ModelCatalog } from './types';
import { CatalogContent } from './CatalogContent';
import { CatalogFiltersModal } from './CatalogFiltersModal';

interface CatalogProps {
	seo: SEO | null;
	filtersConfig: (AutocompleteType | NumberType)[];
	brands: BrandCatalog[];
	models?: ModelCatalog[];
	filtersValues: { [key: string]: string | null };
	total?: number;
	data: Product[];
	isLoading: boolean;
	pageCount: number;
	page: number;
	sort: string;
	onClickFind: () => void;
	onChangeFilterValues: (values: { [key: string]: string | null }) => void;
	onChangeSort: (sort: string) => void;
	onChangeHoveredCategory?: (category: TopCategory | null) => void;
	catalogCategories?: TopCategory[];
	hoveredCategory?: TopCategory | null;
}

export const Catalog: React.FC<CatalogProps> = ({
	filtersConfig,
	seo,
	brands,
	models,
	filtersValues,
	total,
	onClickFind,
	onChangeFilterValues,
	data,
	isLoading,
	pageCount,
	page,
	sort,
	onChangeSort,
	catalogCategories = [],
	hoveredCategory,
	onChangeHoveredCategory
}) => {
	const [filtersModalOpen, setFiltersModalOpen] = useState(false);

	const handleFiltersModalOpen = () => {
		setFiltersModalOpen(true);
	};

	const handleFiltersModalClose = () => {
		setFiltersModalOpen(false);
	};

	return (
        <>
            <CatalogHeader
				seo={seo}
				sort={sort}
				total={total}
				onChangeSort={onChangeSort}
				onOpenFiltersModal={handleFiltersModalOpen}
			/>
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 4
                }}>
				<CatalogSidebar
					filtersConfig={filtersConfig}
					filtersValues={filtersValues}
					total={total}
					onClickFind={onClickFind}
					onChangeFilterValues={onChangeFilterValues}
					catalogCategories={catalogCategories}
					hoveredCategory={hoveredCategory}
					onChangeHoveredCategory={onChangeHoveredCategory}
				/>
				<CatalogContent
					brands={brands}
					models={models}
					filtersValues={filtersValues}
					data={data}
					isLoading={isLoading}
					pageCount={pageCount}
					page={page}
				/>
			</Box>
            <CatalogFiltersModal
				open={filtersModalOpen}
				filtersConfig={filtersConfig}
				filtersValues={filtersValues}
				total={total}
				onClose={handleFiltersModalClose}
				onClickFind={onClickFind}
				onChangeFilterValues={onChangeFilterValues}
			/>
        </>
    );
};
