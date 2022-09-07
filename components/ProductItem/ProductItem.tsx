import {
	Card,
	CardContent,
	Button,
	Link,
	Grid,
	useMediaQuery,
} from '@mui/material';
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
import classNames from 'classnames';

const { publicRuntimeConfig } = getConfig();

interface Props {
	data: Product;
}

const ProductItem = ({ data }: Props) => {
	const router = useRouter();
	const isMobile = useMediaQuery((theme: any) =>
		theme.breakpoints.down('sm')
	);

	const handleClickMore = (slug: string) => () => {
		router.push('/products/' + slug);
	};

	return (
		<Card className={styles.product}>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'flex-start',
					flexDirection: isMobile ? 'column' : 'row',
				}}>
				{data.images && data.images.some((image) => image.formats) ? (
					<Slider
						className={classNames(
							styles.slider,
							isMobile && styles.slider_mobile
						)}
						arrows={false}
						pauseOnHover
						autoplay
						autoplaySpeed={3000}>
						{data.images
							.filter((item) => item.formats)
							.map((item) => (
								<Image
									key={item.id}
									src={
										publicRuntimeConfig.backendLocalUrl +
										`${
											isMobile
												? item.formats?.small.url
												: item.formats?.thumbnail.url
										}`
									}
									width={isMobile ? 500 : 200}
									height={isMobile ? 375 : 150}
									alt={data.name}></Image>
							))}
					</Slider>
				) : (
					<EmptyImageIcon
						size={isMobile ? 300 : 250}
						margin={
							isMobile ? '-30px auto' : '-25px'
						}></EmptyImageIcon>
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
					{!!data.priceUSD && (
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
