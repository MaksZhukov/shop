import {
	Card,
	CardContent,
	Button,
	Link,
	Grid,
	useMediaQuery,
} from '@mui/material';
import { Box } from '@mui/system';
import { Product } from '../../api/types';
import styles from './ProductItem.module.scss';
import getConfig from 'next/config';
// import ShoppingCartButton from 'components/ShoppingCartButton';
import FavoriteButton from 'components/FavoriteButton';
import EmptyImageIcon from 'components/EmptyImageIcon';
import Typography from 'components/Typography';
import NextLink from 'next/link';
import Image from 'next/image';
import Slider from 'react-slick';
import classNames from 'classnames';
import { Image as IImage } from 'api/types';

const { publicRuntimeConfig } = getConfig();

interface Props {
	dataFieldsToShow: { id: string; name: string }[];
	data: Product;
}

const ProductItem = ({ data, dataFieldsToShow }: Props) => {
	const isMobile = useMediaQuery((theme: any) =>
		theme.breakpoints.down('sm')
	);

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
												? item.formats?.small?.url ||
												  item.url
												: item.formats?.thumbnail.url ||
												  item.url
										}`
									}
									width={isMobile ? 500 : 200}
									height={isMobile ? 375 : 150}
									alt={item.alternativeText}></Image>
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
						lineClamp={1}
						title={data.name}
						component='div'
						variant='h5'>
						<NextLink href={`/products/${data.type}/` + data.slug}>
							<Link component='span' underline='hover'>
								{data.h1 || data.name}
							</Link>
						</NextLink>
					</Typography>
					<Grid columnSpacing={2} container>
						{dataFieldsToShow.map((item) => (
							<Grid key={item.id} item>
								<Typography
									fontWeight='500'
									component='div'
									variant='subtitle1'>
									{item.name}
								</Typography>
								{typeof data[item.id as keyof Product] ===
									'object' &&
								data[item.id as keyof Product] !== null
									? //@ts-ignore
									  data[item.id as keyof Product]['name']
									: data[item.id as keyof Product]}
							</Grid>
						))}
					</Grid>
					{data.description && (
						<Typography mt='0.5em' lineClamp={2} variant='body1'>
							<Typography
								fontWeight='500'
								component='span'
								variant='subtitle1'>
								Описание:
							</Typography>{' '}
							{data.description}
						</Typography>
					)}
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
				<Button variant='outlined'>
					<NextLink href={`/products/${data.type}/` + data.slug}>
						Подробнее
					</NextLink>
				</Button>
				<FavoriteButton product={data}></FavoriteButton>
				{/* <ShoppingCartButton product={data}></ShoppingCartButton> */}
			</CardContent>
		</Card>
	);
};

export default ProductItem;
