import { Box, CircularProgress, Pagination, PaginationItem, useMediaQuery, useTheme } from '@mui/material';
import type { Product } from 'entities/product';
import { ProductItem } from 'entities/product';
import { Typography } from 'shared/ui';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import type { BrandCatalog, ModelCatalog } from './types';
import { CartButton } from 'features/cart';
import { FavoriteButton } from 'features/favorites';
import { Link } from 'shared/ui';

interface CatalogContentProps {
	brands: BrandCatalog[];
	models?: ModelCatalog[];
	filtersValues: { [key: string]: string | null };
	data: Product[];
	isLoading: boolean;
	pageCount: number;
	page: number;
}

export const CatalogContent: React.FC<CatalogContentProps> = ({
	brands,
	models,
	filtersValues,
	data,
	isLoading,
	pageCount,
	page
}) => {
	const router = useRouter();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const showBrandsSection = !filtersValues.brand || (models && !filtersValues.model);

	const handleScrollToTop = () => {
		// Use instant scroll on mobile to avoid animation issues
		if (isMobile) {
			window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
		} else {
			window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
		}
	};

	const renderModelLinkEntries = (model: ModelCatalog) => {
		return (
			model.generations?.map((gen) => ({
				key: gen.id,
				path: gen.path,
				label: `${model.name} ${gen.name}`,
				count: gen.count
			})) || [{ key: model.id, path: model.path, label: model.name, count: model.count }]
		);
	};

	return (
		<Box flex={1}>
			{showBrandsSection && !isMobile && (
				<Box
					overflow='auto'
					mb={2}
					boxShadow={`0px 10px 25px 0px ${theme.palette.custom.shadow}`}
					px={2}
					py={2}
					minHeight={360}
					display='flex'
					flexDirection='column'
					flexWrap='wrap'
					height={360}
					gap={2}
					borderRadius={4}
					border='1px solid custom.divider'
					bgcolor='custom.bg-surface-1'
				>
					{!filtersValues.brand &&
						brands.map((brand) => (
							<Box py={1} display='flex' gap={0.5} key={brand.id}>
								<Link href={brand.path}>{brand.name}</Link>
								{brand.count != null && (
									<Typography color='custom.text-muted'>{brand.count}</Typography>
								)}
							</Box>
						))}
					{models &&
						filtersValues.brand &&
						!filtersValues.model &&
						models.flatMap(renderModelLinkEntries).map((entry) => (
							<Box display='flex' gap={0.5} py={1} key={entry.key}>
								<Link href={entry.path}>{entry.label}</Link>
								<Typography color='custom.text-muted'>{entry.count}</Typography>
							</Box>
						))}
				</Box>
			)}
			<Box
				display='flex'
				flexWrap='wrap'
				justifyContent={{ xs: 'center', md: 'flex-start' }}
				sx={{ opacity: isLoading ? 0.5 : 1 }}
				gap={1}
				mb={2}
			>
				{data.length ? (
					data.map((item) => (
						<ProductItem
							sx={{ margin: 'initial' }}
							width={isMobile ? 340 : 278}
							imageHeight={220}
							key={item.id}
							data={item}
							headerActions={<FavoriteButton product={item} />}
							bottomActions={
								<CartButton
									product={item}
									sx={{ display: { xs: 'none', md: 'block' }, width: '100%' }}
								/>
							}
						/>
					))
				) : !isLoading ? (
					<Typography textAlign='center' variant='h5'>
						Данных не найдено
					</Typography>
				) : (
					<CircularProgress sx={{ margin: 'auto' }} />
				)}
			</Box>
			{pageCount > 0 && (
				<Pagination
					sx={{
						display: 'flex',
						justifyContent: 'center'
					}}
					renderItem={(params) =>
						params.page === null ? (
							<PaginationItem {...params} onClick={handleScrollToTop}>
								{params.page}
							</PaginationItem>
						) : (
							<NextLink
								shallow
								href={`${router.asPath.split('?')[0]}?${new URLSearchParams({
									...router.query,
									page: params.page.toString()
								}).toString()}`}
							>
								<PaginationItem {...params} onClick={handleScrollToTop}>
									{params.page}
								</PaginationItem>
							</NextLink>
						)
					}
					boundaryCount={1}
					page={+page}
					siblingCount={1}
					color='primary'
					count={pageCount}
					variant='text'
				/>
			)}
		</Box>
	);
};
