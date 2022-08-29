import { Card, CardContent, Button, Link, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { Product } from '../../api/products/types';
import styles from './ProductItem.module.scss';
import getConfig from 'next/config';
import ShoppingCartButton from 'components/ShoppingCartButton';
import FavoriteButton from 'components/FavoriteButton';
import EmptyImageIcon from 'components/EmptyImageIcon';
import Typography from 'components/Typography';
import Image from 'next/image';
import Slider from 'react-slick';

const { publicRuntimeConfig } = getConfig();

interface Props {
	data: Product;
}

const ProductItem = ({ data }: Props) => {
	const router = useRouter();

	const handleClickMore = (slug: string) => () => {
		router.push('/products/' + slug);
	};

	return (
		<Card sx={{ marginBottom: '2em' }} className={styles.product}>
			<Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
				{data.images ? (
					<Slider
						className={styles.slider}
						arrows={false}
						pauseOnHover
						autoplay
						autoplaySpeed={3000}>
						{data.images.map((item) => (
							<Image
								key={item.id}
								src={
									publicRuntimeConfig.backendLocalUrl +
									item.formats.thumbnail.url
								}
								width={200}
								height={150}
								alt={data.name}></Image>
						))}
					</Slider>
				) : (
					<EmptyImageIcon size={250} margin='-25px'></EmptyImageIcon>
				)}
				<CardContent sx={{ flex: 1, paddingY: '0!important' }}>
					<Typography
						onClick={handleClickMore(data.slug)}
						lineClamp={1}
						title={data.name}
						component='div'
						variant='h5'>
						<Link underline='hover'>{data.name}</Link>
					</Typography>
					<Grid columnSpacing={2} container>
						<Grid item>
							<Typography
								fontWeight='500'
								component='div'
								variant='subtitle1'>
								Марка
							</Typography>
							{data.brand?.name}
						</Grid>
						<Grid item>
							<Typography
								fontWeight='500'
								component='div'
								variant='subtitle1'>
								Модель
							</Typography>
							{data.model?.name}
						</Grid>
						<Grid item>
							<Typography
								fontWeight='500'
								component='div'
								variant='subtitle1'>
								Запчасть
							</Typography>
							{data.sparePart?.name}
						</Grid>
					</Grid>
					<Typography mt='0.5em' lineClamp={2} variant='body1'>
						<Typography
							fontWeight='500'
							component='span'
							variant='subtitle1'>
							Описание:
						</Typography>{' '}
						{data.description}
					</Typography>
				</CardContent>
			</Box>

			<CardContent sx={{ display: 'flex', alignItems: 'center' }}>
				<Typography
					flex='1'
					fontWeight='bold'
					variant='body1'
					color='primary'>
					Цена: {data.price} руб{' '}
					{data.priceUSD && (
						<Typography color='text.secondary' component='sup'>
							(~{data.priceUSD.toFixed()}$)
						</Typography>
					)}
				</Typography>
				<Button onClick={handleClickMore(data.slug)} variant='outlined'>
					Подробнее
				</Button>
				<FavoriteButton product={data}></FavoriteButton>
				<ShoppingCartButton product={data}></ShoppingCartButton>
			</CardContent>
		</Card>
	);
};

export default ProductItem;
