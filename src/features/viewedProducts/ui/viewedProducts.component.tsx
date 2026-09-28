import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SparePartService, type SparePart } from 'entities/sparePart';
import { productViewedLocalStorage } from 'entities/product';
import { ProductItem } from 'entities/product';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { Box } from '@mui/material';
import { Carousel } from 'shared/ui';
import { inject } from '../viewedProducts.di';

type ViewedProductsProps = {
	renderHeaderActions?: (product: SparePart) => ReactNode;
	renderBottomActions?: (product: SparePart) => ReactNode;
};

export const ViewedProducts = ({ renderHeaderActions, renderBottomActions }: ViewedProductsProps) => {
	const sparePartService = inject(SparePartService);
	const viewedProducts = productViewedLocalStorage.getViewedProducts();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const { data: viewedProductsData } = useQuery({
		queryKey: ['viewedProducts'],
		queryFn: () =>
			sparePartService.fetchSpareParts({
				populate: ['images', 'brand'],
				filters: { id: { $in: viewedProducts.map((item) => item.id) } }
			}),
		enabled: !!viewedProducts.length
	});
	return (
        <Box>
            {viewedProductsData?.data.data.length && (
				<>
					<Typography variant='h6' gutterBottom sx={{
                        mt: 3
                    }}>
						Вы недавно смотрели
					</Typography>
					<Carousel carouselContainerSx={{ ml: -1 }} showDots={false}>
						{viewedProductsData.data.data.map((item) => (
							<Box key={item.id} sx={{
                                pl: 1
                            }}>
								<ProductItem
									headerActions={renderHeaderActions?.(item)}
									bottomActions={renderBottomActions?.(item)}
									imageHeight={isMobile ? 115 : 215}
									width={isMobile ? 150 : 280}
									sx={{ margin: 'initial' }}
									key={item.id}
									data={item}
								/>
							</Box>
						))}
					</Carousel>
				</>
			)}
        </Box>
    );
};
