import { SxProps, useMediaQuery, Box } from '@mui/material';
import FavoriteButton from 'components/features/FavoriteButton';
import Image from 'components/features/Image';
import { Typography, WhiteBox, Button, Link } from 'components/ui';
import { CartFilledIcon } from 'components/icons/CartFilledIcon';
import { Product } from 'api/types';
import { isSparePart } from 'services/ProductService';
import { Carousel } from 'components/ui/Carousel';

interface Props {
	data: Product;
	width?: number;
	imageHeight?: number;
	sx?: SxProps;
}

const ProductItem = ({ data, width = 280, imageHeight = 290, sx = { margin: 'auto' } }: Props) => {
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
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
			{data.images ? (
				<Box>
					<Carousel options={{ axis: 'x', loop: false }} showArrows={false} showDots={true}>
						{data.images?.map((image) => (
							<Box key={image.id} height={imageHeight + imageHeightOffset}>
								<Image
									title={image.caption}
									width={width}
									height={imageHeight}
									style={{
										objectFit: 'cover'
									}}
									alt={image.alternativeText}
									src={image.url}
								></Image>
							</Box>
						))}
					</Carousel>
				</Box>
			) : (
				<Box>
					<Image
						title={data.h1}
						style={{
							objectFit: 'cover',
							margin: 'auto'
						}}
						src=''
						width={width}
						height={imageHeight + imageHeightOffset}
						alt={data.h1}
					></Image>
				</Box>
			)}

			<Box p={1.5}>
				<Box display='flex' alignItems='center' gap={1} mb={1}>
					<Typography variant='h6' fontSize='20px' color='text.secondary'>
						{data.price} руб
					</Typography>
					{data.discountPrice ? (
						<>
							<Typography sx={{ textDecoration: 'line-through' }} color='custom.text-muted'>
								{data.discountPrice} руб
							</Typography>
							<Typography color='text.secondary'>
								{((data.discountPrice / data.price) * 100).toFixed()}%
							</Typography>
						</>
					) : null}
				</Box>
				<Link href={`/spare-parts/${data.brand?.slug}/${data.id}`} lineClamp={2} sx={{ height: 34 }}>
					{data.h1}
				</Link>
				<Typography mb={1} color='custom.text-muted'>
					{isSparePart(data) &&
						[data.volume?.name, data.fuel, data.transmission, data.year].filter(Boolean).join(', ')}
				</Typography>
				{!isMobile && (
					<Button fullWidth variant='contained' startIcon={<CartFilledIcon />}>
						В корзину
					</Button>
				)}
			</Box>
		</WhiteBox>
	);
};

export default ProductItem;
