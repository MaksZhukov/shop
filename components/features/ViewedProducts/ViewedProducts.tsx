import { useQuery } from '@tanstack/react-query';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { viewedProductsService } from 'services/LocalStorageService';
import ProductItem from '../ProductItem';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { Box } from '@mui/material';
import { Carousel } from 'components/ui';

export const ViewedProducts = () => {
	const viewedProducts = viewedProductsService.getViewedProducts();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const { data: viewedProductsData } = useQuery({
		queryKey: ['viewedProducts'],
		queryFn: () =>
			fetchSpareParts({
				populate: ['images', 'brand'],
				filters: { id: { $in: viewedProducts.map((item) => item.id) } }
			}),
		enabled: !!viewedProducts.length
	});
	return (
		<Box>
			{viewedProductsData?.data.data.length && (
				<>
					<Typography mt={3} variant='h6' gutterBottom>
						Вы недавно смотрели
					</Typography>
					<Carousel carouselContainerSx={{ ml: -1 }} showDots={false}>
						{viewedProductsData.data.data.map((item) => (
							<Box pl={1} key={item.id}>
								<ProductItem
									withCartIcon={isMobile ? false : true}
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
