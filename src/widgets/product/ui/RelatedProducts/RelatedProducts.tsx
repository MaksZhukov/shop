import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Carousel } from 'shared/ui';
import { ProductItem } from 'entities/product';
import type { Product } from 'entities/product';
import { FavoriteButton } from 'features/favorites';
import { CartButton } from 'features/cart';
import { isSparePart, isTire, isWheel } from 'entities/product';

interface Props {
	product: Product;
	relatedProducts: Product[];
}

const getRelatedProductsTitle = (product: Product): string => {
	const brandName = product.brand?.name || '';
	const modelName = isSparePart(product) ? product.model?.name : '';
	const generationName = isSparePart(product) ? product.generation?.name : '';

	let prefix = '';
	if (isSparePart(product)) {
		prefix = 'Другие запчасти для';
	} else if (isTire(product)) {
		prefix = 'Другие шины для';
	} else if (isWheel(product)) {
		prefix = 'Другие диски для';
	} else if (product.type === 'cabin') {
		prefix = 'Другие салоны для';
	}

	return `${prefix} ${brandName} ${modelName} ${generationName}`.trim();
};

export const RelatedProducts = ({ product, relatedProducts }: Props) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	if (relatedProducts.length === 0) {
		return null;
	}

	return (
		<>
			<Typography mb={1} variant='h6' fontWeight='bold'>
				{getRelatedProductsTitle(product)}
			</Typography>
			<Carousel
				sx={{ mb: 3 }}
				options={{ axis: 'x', watchDrag: false, loop: true }}
				showArrows={true}
				showDots={false}
				carouselContainerSx={{ ml: -1 }}
			>
				{relatedProducts.map((item) => (
					<Box pl={1} key={item.id}>
						<ProductItem
							data={item}
							width={isMobile ? 155 : 228}
							imageHeight={isMobile ? 120 : 180}
							headerActions={<FavoriteButton product={item} />}
							bottomActions={
								<CartButton
									product={item}
									sx={{ display: { xs: 'none', md: 'block' }, width: '100%' }}
								/>
							}
						/>
					</Box>
				))}
			</Carousel>
		</>
	);
};
