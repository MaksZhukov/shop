import { SxProps, Box } from '@mui/material';
import FavoriteButton from 'components/features/FavoriteButton';
import { Typography, WhiteBox, Link } from 'components/ui';
import { Product } from 'api/types';
import { isSparePart } from 'services/ProductService';
import { CartButton } from '../CartButton';
import { ProductPrice } from '../ProductPrice';
import { ProductItemImages } from 'components/features/ProductItemImages';

interface Props {
	data: Product;
	width?: number;
	imageHeight?: number;
	withCartIcon?: boolean;
	sx?: SxProps;
}

const ProductItem = ({ data, width = 280, imageHeight = 290, sx = { margin: 'auto' }, withCartIcon = true }: Props) => {
	const imageHeightOffset = 20;

	return (
		<WhiteBox
			overflow={'hidden'}
			width={width}
			bgcolor='background.paper'
			position='relative'
			key={data.id}
			sx={sx}
		>
			<Box position='absolute' zIndex={1} right={1} top={1}>
				<FavoriteButton product={data}></FavoriteButton>
			</Box>
			<ProductItemImages
				data={data}
				width={width}
				imageHeight={imageHeight}
				imageHeightOffset={imageHeightOffset}
			/>

			<Box p={1.5}>
				<ProductPrice data={data} />
				<Link href={`/spare-parts/${data.brand?.slug}/${data.id}`} lineClamp={2} sx={{ height: 34 }}>
					{data.h1}
				</Link>
				<Typography mb={1} color='custom.text-muted'>
					{isSparePart(data) &&
						[data.volume?.name, data.fuel, data.transmission, data.year].filter(Boolean).join(', ')}
				</Typography>

				<CartButton product={data} sx={{ display: { xs: 'none', md: 'block' }, width: '100%' }} />
			</Box>
		</WhiteBox>
	);
};

export default ProductItem;
