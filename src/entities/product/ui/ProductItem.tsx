import { SxProps, Box } from '@mui/material';
import { Typography, WhiteBox, Link } from 'shared/ui';
import { Product, getProductLink, getProductDetails } from 'entities/product';
import { ProductPrice } from './ProductPrice';
import { ProductItemImages } from './ProductItemImages';

interface Props {
	data: Product;
	width?: number;
	imageHeight?: number;
	headerActions?: React.ReactNode;
	bottomActions?: React.ReactNode;
	sx?: SxProps;
}

export const ProductItem = ({
	data,
	width = 280,
	imageHeight = 290,
	headerActions,
	bottomActions,
	sx = { margin: 'auto' }
}: Props) => {
	const imageHeightOffset = 20;
	return (
		<WhiteBox
			key={data.id}
			sx={[
				{
					overflow: 'hidden',
					width,
					bgcolor: 'background.paper',
					position: 'relative'
				},
				...(Array.isArray(sx) ? sx : sx ? [sx] : [])
			]}>
            <Box
                sx={{
                    position: 'absolute',
                    zIndex: 1,
                    right: 1,
                    top: 1
                }}>
				{headerActions}
			</Box>
            <ProductItemImages
				data={data}
				width={width}
				imageHeight={imageHeight}
				imageHeightOffset={imageHeightOffset}
			/>
            <Box sx={{
                p: 1.5
            }}>
				<ProductPrice data={data} />
				<Link href={getProductLink(data)} lineClamp={2} sx={{ height: 34 }}>
					{data.h1}
				</Link>
				<Typography color='custom.text-muted' sx={{ mb: 1 }}>
					{getProductDetails(data)}
				</Typography>
				{bottomActions}
			</Box>
        </WhiteBox>
    );
};
