import { useQuery } from '@tanstack/react-query';
import { sparePartApi } from 'entities/sparePart';
import { productViewedLocalStorage } from 'entities/product';
import { ProductItem } from 'entities/product';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { Box } from '@mui/material';
import { Carousel } from 'shared/ui';
import { FavoriteButton } from 'features/favorites';
import { CartButton } from 'features/cart';

export const ViewedProducts = () => {
	const viewedProducts = productViewedLocalStorage.getViewedProducts();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const { data: viewedProductsData } = useQuery({
		queryKey: ['viewedProducts'],
		queryFn: () =>
			sparePartApi.fetchSpareParts({
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
									headerActions={<FavoriteButton product={item} />}
									bottomActions={
										<CartButton
											product={item}
											sx={{ display: { xs: 'none', md: 'block' }, width: '100%' }}
										/>
									}
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
