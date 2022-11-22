import { RestorePageOutlined } from '@mui/icons-material';
import { Box, Button, Link, Typography, useMediaQuery } from '@mui/material';
import { Container } from '@mui/system';
import { fetchPageProduct } from 'api/pageProduct/pageProduct';
import { PageProduct } from 'api/pageProduct/types';
import { fetchTireBrands } from 'api/tireBrands/tireBrands';
import { fetchTire, fetchTires } from 'api/tires/tires';
import { Tire } from 'api/tires/types';
import { Product, ProductType } from 'api/types';
import { Wheel } from 'api/wheels/types';
import { fetchWheel, fetchWheels } from 'api/wheels/wheels';
import axios from 'axios';
import classNames from 'classnames';
import CarouselProducts from 'components/CarouselProducts';
import EmptyImageIcon from 'components/EmptyImageIcon';
import FavoriteButton from 'components/FavoriteButton';
import HeadSEO from 'components/HeadSEO';
import LinkWithImage from 'components/LinkWithImage';
import ReactMarkdown from 'components/ReactMarkdown';
import SEOBox from 'components/SEOBox';

// import ShoppingCartButton from 'components/ShoppingCartButton';
import WhiteBox from 'components/WhiteBox';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import Image from 'next/image';
import NextLink from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import { isTire, isWheel } from 'services/ProductService';
import {
	fetchSparePart,
	fetchSpareParts,
} from '../../../api/spareParts/spareParts';
import { SparePart } from '../../../api/spareParts/types';
import styles from './product.module.scss';

const { publicRuntimeConfig } = getConfig();

interface Props {
	data: Product;
	page: PageProduct;
	relatedProducts: Product[];
}

const ProductPage = ({ data, page, relatedProducts }: Props) => {
	const [sliderBig, setSliderBig] = useState<Slider | null>(null);
	const [sliderSmall, setSliderSmall] = useState<Slider | null>(null);
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
						alignItems='baseline'
						justifyContent='space-between'>
						<Box>
							<Typography
								variant='h4'
								flex='1'
								overflow='hidden'
								title={data.name}
								textOverflow='ellipsis'
								whiteSpace='nowrap'
								component='h1'>
								{data.h1 || data.name}
							</Typography>
							{data.snippets?.textAfterH1 && (
								<ReactMarkdown
									content={
										data.snippets.textAfterH1
									}></ReactMarkdown>
							)}
						</Box>
						<Link variant='h5' href='tel:+375297804780'>
							+375 29 780 4 780
						</Link>
						{/* <ShoppingCartButton product={data}></ShoppingCartButton> */}
					</Box>
					<Box
						display='flex'
						sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
						{data.images ? (
							<>
								<Box maxWidth='640px'>
									<Slider
										ref={(ref) => {
											setSliderBig(ref);
										}}
										asNavFor={sliderSmall || undefined}
										arrows={false}
										autoplay
										autoplaySpeed={5000}
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
									<Slider
										ref={(ref) => {
											setSliderSmall(ref);
										}}
										swipeToSlide
										slidesToShow={
											data.images.length >= 5
												? 5
												: data.images.length
										}
										focusOnSelect
										className={classNames(
											styles.slider,
											styles.slider_small
										)}
										asNavFor={sliderBig || undefined}>
										{data.images.map((item) => (
											<Box key={item.id}>
												<Image
													style={{ margin: 'auto' }}
													alt={item.alternativeText}
													width={104}
													height={78}
													src={
														publicRuntimeConfig.backendLocalUrl +
														item.formats?.thumbnail
															.url
													}></Image>
											</Box>
										))}
									</Slider>
								</Box>
							</>
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

								<Typography
									flex='1'
									marginTop='1em'
									marginBottom='1em'
									fontWeight='bold'
									variant='body1'
									color='primary'>
									Цена: {data.price} руб{' '}
									{!!data.priceUSD && (
										<Typography
											color='text.secondary'
											component='sup'>
											(~{data.priceUSD.toFixed()}$)
										</Typography>
									)}
								</Typography>
								<Button
									variant='contained'
									component='a'
									href='tel:+375297804780'>
									Заказать
								</Button>
							</Box>
						</Box>
					</Box>
					{!!page.linksWithImages?.length && (
						<Box
							marginTop='2em'
							display='flex'
							justifyContent={'space-around'}>
							{page.linksWithImages.map((item) => (
								<LinkWithImage
									key={item.id}
									image={item.image}
									link={item.link}></LinkWithImage>
							))}
						</Box>
					)}
					<Typography marginTop='1em' component='h2' variant='h5'>
						{data.seo?.h1 || data.name} характеристики
					</Typography>
					{data.snippets && (
						<>
							{data.snippets.textAfterDescription && (
								<ReactMarkdown
									content={
										data.snippets.textAfterDescription
									}></ReactMarkdown>
							)}
							{data.snippets.benefits && (
								<>
									<Typography component='h3' variant='h5'>
										Почему мы лучшие в своем деле?
									</Typography>
									<Box
										marginTop='2em'
										display='flex'
										justifyContent={'space-around'}>
										{data.snippets.benefits.map((item) => (
											<Box maxWidth={208} key={item.id}>
												<Image
													alt={item.alternativeText}
													width={208}
													height={156}
													src={
														publicRuntimeConfig.backendLocalUrl +
														item.formats?.thumbnail
															.url
													}></Image>
												<Typography
													component='p'
													variant='body1'>
													{item.caption}
												</Typography>
											</Box>
										))}
									</Box>
								</>
							)}
							{data.snippets.textAfterBenefits && (
								<ReactMarkdown
									content={
										data.snippets.textAfterBenefits
									}></ReactMarkdown>
							)}
						</>
					)}
				</WhiteBox>
				<SEOBox
					content={data.seo?.content}
					images={data.seo?.images}></SEOBox>
				<CarouselProducts
					title={
						<Typography
							component='h2'
							marginBottom='1em'
							marginTop='1em'
							textAlign='center'
							variant='h4'>
							А ещё у нас есть для этого авто
						</Typography>
					}
					data={relatedProducts}></CarouselProducts>
			</Container>
		</>
	);
};

export const getServerSideProps: GetServerSideProps<
	{},
	{ slug: string; type: ProductType }
> = async (context) => {
	let data = null;
	let page = null;
	let relatedProducts: Product[] = [];
	let notFound = false;
	try {
		let fetchFuncData = {
			sparePart: fetchSparePart,
			tire: fetchTire,
			wheel: fetchWheel,
		}[context.params?.type || 'sparePart'];
		let fetchRelationalProducts = {
			sparePart: fetchSpareParts,
			tire: fetchTires,
			wheel: fetchWheels,
		}[context.params?.type || 'sparePart'];
		const [response, responsePageProduct] = await Promise.all([
			fetchFuncData(context.params?.slug || '', true),
			fetchPageProduct(),
		]);
		data = response.data.data;
		page = responsePageProduct.data.data;
		const responseRelated = await fetchRelationalProducts(
			{
				filters: {
					id: {
						$ne: data.id,
					},
					...(isTire(data)
						? { brand: data.brand.id }
						: { model: data.model?.id || '' }),
				},
				populate: ['images'],
			},
			true
		);
		relatedProducts = responseRelated.data.data;
	} catch (err) {
		if (axios.isAxiosError(err)) {
			console.error(err);
			notFound = true;
		}
	}

	return {
		notFound,
		props: { data, page, relatedProducts },
	};
};

export default ProductPage;
