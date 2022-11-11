import { Box, Typography, useMediaQuery } from '@mui/material';
import { Container } from '@mui/system';
import { fetchTire } from 'api/tires/tires';
import { Tire } from 'api/tires/types';
import { Product, ProductType } from 'api/types';
import { Wheel } from 'api/wheels/types';
import { fetchWheel } from 'api/wheels/wheels';
import axios from 'axios';
import EmptyImageIcon from 'components/EmptyImageIcon';
import FavoriteButton from 'components/FavoriteButton';
import HeadSEO from 'components/HeadSEO';
import ShoppingCartButton from 'components/ShoppingCartButton';
import WhiteBox from 'components/WhiteBox';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import Image from 'next/image';
import Slider from 'react-slick';
import { isWheel } from 'services/ProductService';
import { fetchSparePart } from '../../../api/spareParts/spareParts';
import { SparePart } from '../../../api/spareParts/types';
import styles from './product.module.scss';

const { publicRuntimeConfig } = getConfig();

interface Props {
	data: Product;
}

const ProductPage = ({ data }: Props) => {
	const isTablet = useMediaQuery((theme: any) =>
		theme.breakpoints.down('md')
	);
	const isMobile = useMediaQuery((theme: any) =>
		theme.breakpoints.down('sm')
	);

	const getSparePartPrintOptions = (item: SparePart) => [
		{ text: 'Артикул', value: item.id },
		{ text: 'Марка', value: item.brand?.name },
		{ text: 'Модель', value: item.model?.name },
		{ text: 'Поколение', value: item.generation?.name },
		{ text: 'Запчасть', value: item.kindSparePart?.name },
		{ text: 'Коробка', value: item.transmission },
		{ text: 'Обьем', value: item.volume },
	];

	const getTirePrintOptions = (item: Tire) => [
		{ text: 'Артикул', value: item.id },
		{ text: 'Количество', value: item.count },
		{ text: 'Марка', value: item.brand?.name },
		{ text: 'Диаметр', value: item.diameter },
		{ text: 'Высота', value: item.height },
		{ text: 'Ширина', value: item.width },
		{ text: 'Сезон', value: item.season },
	];
	const getWheelPrintOptions = (item: Wheel) => [
		{ text: 'Артикул', value: item.id },
		{ text: 'Тип', value: item.kind },
		{ text: 'Количество', value: item.count },
		{ text: 'Марка', value: item.brand?.name },
		{ text: 'Модель', value: item.model?.name },
		{ text: 'R Диаметр', value: item.diameter },
		{ text: 'J Ширина', value: item.width },
		{ text: 'Количество отверстий', value: item.numberHoles },
		{ text: 'PCD расстояние между отверстиями', value: item.numberHoles },
		{
			text: 'DIA диаметр центрального отверстия',
			value: item.diameterCenterHole,
		},
		{
			text: 'ET вылет',
			value: item.diskOffset,
		},
	];

	let printOptions = {
		tire: getTirePrintOptions(data as Tire),
		sparePart: getSparePartPrintOptions(data as SparePart),
		wheel: getWheelPrintOptions(data as Wheel),
	}[data.type];

	const keywordsContent = {
		sparePart: 'запчасть, купить запчасть, продажа запчасти, запчасть авто',
		wheel: 'диск, купить диск, продажа диска, диск авто',
		tire: 'шина, купить шину, продажа шины, шина авто',
	}[data.type];

	return (
		<>
			<HeadSEO
				title={data.seo?.title || data.name}
				description={data.seo?.description || `Описание ${data.name}`}
				keywords={data.seo?.keywords || keywordsContent}></HeadSEO>
			<Container>
				<WhiteBox padding='2em'>
					<Box
						marginBottom='1em'
						display='flex'
						alignItems='center'
						justifyContent='center'>
						<Typography
							variant='h4'
							flex='1'
							overflow='hidden'
							title={data.name}
							textOverflow='ellipsis'
							whiteSpace='nowrap'
							component='h1'>
							{data.name}
						</Typography>
						<ShoppingCartButton product={data}></ShoppingCartButton>
						<FavoriteButton product={data}></FavoriteButton>
					</Box>
					<Box
						display='flex'
						sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
						{data.images ? (
							<Slider
								autoplay
								autoplaySpeed={3000}
								dots
								className={styles.slider}>
								{data.images.map((item) => (
									<Image
										key={item.id}
										alt={item.alternativeText}
										width={640}
										height={480}
										src={
											publicRuntimeConfig.backendLocalUrl +
											item.url
										}></Image>
								))}
							</Slider>
						) : (
							<EmptyImageIcon
								size={isMobile ? 300 : isTablet ? 500 : 700}
								margin={'-8%'}></EmptyImageIcon>
						)}
						<Box
							flex='1'
							display='flex'
							sx={{
								flexDirection: {
									xs: 'column-reverse',
									sm: 'row',
									md: 'column-reverse',
									lg: 'row',
								},
							}}>
							<Box
								flex='1'
								sx={{
									padding: { xs: '0', md: '0 1em 0 3em' },
								}}>
								{printOptions.map((item) => (
									<Box display='flex' key={item.value}>
										<Typography
											mr='1em'
											width={
												isWheel(data) ? '110px' : '90px'
											}
											fontWeight='500'
											variant='subtitle1'
											component='span'>
											{item.text}:
										</Typography>
										<Typography component='span'>
											{item.value}
										</Typography>
									</Box>
								))}
							</Box>
							<Box>
								<Typography
									textAlign='right'
									variant='h5'
									width='100%'
									color='primary'>
									{data.price} р.
								</Typography>
								<Typography
									textAlign='right'
									variant='h5'
									width='100%'
									color='text.secondary'>
									~ {data.priceUSD?.toFixed()} $
								</Typography>
							</Box>
						</Box>
					</Box>
					{data.description && (
						<Box>
							<Typography
								mr='1em'
								fontWeight='500'
								variant='subtitle1'
								component='span'>
								Описание:
							</Typography>
							<Typography color='text.secondary'>
								{data.description}
							</Typography>
						</Box>
					)}
				</WhiteBox>
			</Container>
		</>
	);
};

export const getServerSideProps: GetServerSideProps<
	{},
	{ slug: string; type: ProductType }
> = async (context) => {
	let data = null;
	let notFound = false;
	try {
		let fetchFunc = {
			sparePart: fetchSparePart,
			tire: fetchTire,
			wheel: fetchWheel,
		}[context.params?.type || 'sparePart'];
		const response = await fetchFunc(context.params?.slug || '', true);
		data = response.data.data;
	} catch (err) {
		if (axios.isAxiosError(err)) {
			notFound = true;
		}
	}

	return {
		notFound,
		props: { data },
	};
};

export default ProductPage;
