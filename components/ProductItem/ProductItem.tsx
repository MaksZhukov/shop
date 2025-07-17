import { Button, Grid, Link, useMediaQuery } from '@mui/material';
import { Box } from '@mui/material';
import FavoriteButton from 'components/FavoriteButton';
import Image from 'components/Image';
import Typography from 'components/Typography';
import Carousel from 'react-multi-carousel';
import WhiteBox from 'components/WhiteBox';
import { CartFilledIcon } from 'components/Icons/CartFilledIcon';
import { SparePart } from 'api/spareParts/types';
import styles from './ProductItem.module.scss';

interface Props {
	data: SparePart;
	width?: number;
}

const ProductItem = ({ data, width = 280 }: Props) => {
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

	return (
		<WhiteBox overflow={'hidden'} width={width} bgcolor='#fff' position='relative' key={data.id}>
			<Box position='absolute' zIndex={1} right={1} top={1}>
				<FavoriteButton product={data}></FavoriteButton>
			</Box>
			{data.images ? (
				<Box>
					<Carousel
						dotListClass={styles['dot-list']}
						responsive={{
							desktop: {
								breakpoint: { max: 3000, min: 0 },
								items: 1
							}
						}}
						infinite={true}
						autoPlay
						showDots
						arrows={false}
					>
						{data.images?.map((image) => (
							<Box key={image.id} height={290}>
								<Image
									title={image.caption}
									width={width}
									height={270}
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
						height={290}
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
				<Typography mb={1} lineClamp={2} color='text.primary' minHeight={42}>
					{data.h1}
				</Typography>
				<Typography mb={1} color='custom.text-muted'>
					{[data.volume?.name, data.fuel, data.transmission].filter(Boolean).join(', ')}
				</Typography>
				<Button fullWidth variant='contained' startIcon={<CartFilledIcon />}>
					В корзину
				</Button>
			</Box>
		</WhiteBox>
	);
};

export default ProductItem;
