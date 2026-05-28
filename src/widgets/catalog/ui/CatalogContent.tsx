import { Box, CircularProgress, Pagination, PaginationItem, useMediaQuery, useTheme } from '@mui/material';
import type { Product } from 'entities/product';
import { ProductItem } from 'entities/product';
import { Typography } from 'shared/ui';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import type { CatalogReference } from './types';
import { CartButton } from 'features/cart';
import { FavoriteButton } from 'features/favorites';
import { Link } from 'shared/ui';

interface CatalogContentProps {
	references?: CatalogReference[];
	showReferencesPanel?: boolean;
	isReferencesLoading?: boolean;
	data: Product[];
	isLoading: boolean;
	pageCount: number;
	page: number;
}

export const CatalogContent: React.FC<CatalogContentProps> = ({
	references = [],
	showReferencesPanel = false,
	isReferencesLoading = false,
	data,
	isLoading,
	pageCount,
	page
}) => {
	const router = useRouter();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const handleScrollToTop = () => {
		if (isMobile) {
			window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
		} else {
			window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
		}
	};

	const getPageHref = (page: number) => {
		const basePath = router.asPath.split('?')[0];
		const { slug, ...restQuery } = router.query;
		const query: Record<string, string> = { ...restQuery } as Record<string, string>;
		if (page !== 1) {
			query.page = page.toString();
		} else {
			delete query.page;
		}
		const search = new URLSearchParams(query).toString();
		return search ? `${basePath}?${search}` : basePath;
	};

	return (
		<Box
			sx={{
				flex: 1
			}}
		>
			{showReferencesPanel && !isMobile && (
				<Box
					sx={{
						overflow: 'auto',
						mb: 2,
						boxShadow: '0px 10px 25px 0px #1018281F',
						px: 2,
						py: 2,
						minHeight: 360,
						display: 'flex',
						flexDirection: 'column',
						flexWrap: 'wrap',
						height: 360,
						gap: 2,
						borderRadius: 4,
						border: '1px solid',
						borderColor: 'custom.divider',
						bgcolor: 'custom.bg-surface-1'
					}}
				>
					{isReferencesLoading ? (
						<CircularProgress sx={{ margin: 'auto' }} />
					) : (
						references.map((item) => (
							<Box
								key={item.id}
								sx={{
									display: 'flex',
									gap: 0.5,
									py: 1
								}}
							>
								<Link href={item.href}>{item.label}</Link>
								{item.count != null && <Typography color='custom.text-muted'>{item.count}</Typography>}
							</Box>
						))
					)}
				</Box>
			)}
			<Box
				sx={{
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: { xs: 'center', md: 'flex-start' },
					gap: 1,
					mb: 2,
					opacity: isLoading ? 0.5 : 1
				}}
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
					<Typography variant='h5' align='center'>
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
							<NextLink shallow href={getPageHref(params.page)}>
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
