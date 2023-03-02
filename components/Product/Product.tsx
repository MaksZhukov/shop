import {
	Box,
	Button,
	IconButton,
	Link,
	Modal,
	Table,
	TableBody,
	TableCell,
	TableRow,
	useMediaQuery,
} from '@mui/material';
import { PageProduct } from 'api/pages/types';
import {
	BrandTextComponent,
	Image as IImage,
	LinkWithImage as ILinkWithImage,
	Product as IProduct,
	ProductType,
} from 'api/types';
import Head from 'next/head';
import CloseIcon from '@mui/icons-material/Close';
import classNames from 'classnames';
import CarouselProducts from 'components/CarouselProducts';
import FavoriteButton from 'components/FavoriteButton';
import Image from 'components/Image';
import ReactMarkdown from 'components/ReactMarkdown';
import { FC, useState } from 'react';
import Slider from 'react-slick';
import { getStringByTemplateStr } from 'services/StringService';
import { Brand, ProductBrandTexts } from 'api/brands/types';
import Typography from 'components/Typography';
import Buy from 'components/Buy';
import styles from './product.module.scss';
import { isTireBrand } from 'services/ProductService';
import GalleryImages from 'components/GalleryImages/GalleryImages';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
const { publicRuntimeConfig } = getConfig();

interface Props {
	page: PageProduct & { textAfterDescription: string };
	data: IProduct;
	relatedProducts: IProduct[];
	printOptions: { text: string; value?: string | number }[];
}

const Product: FC<Props> = ({ data, printOptions, page, relatedProducts }) => {
	const [sliderBig, setSliderBig] = useState<Slider | null>(null);
	const [sliderSmall, setSliderSmall] = useState<Slider | null>(null);
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
	const [sold, setSold] = useState<boolean>(data.sold);
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

	const handleSold = () => {
		setSold(true);
	};

	let brandText =
		data.brand && isTireBrand(data.brand)
			? data.brand?.productBrandText?.content
			: data.brand?.productBrandTexts
			? data.brand?.productBrandTexts[
					Object.keys(
						(data.brand as Brand).productBrandTexts as BrandTextComponent
					)[1] as keyof ProductBrandTexts
			  ]?.content
			: '';

	const getSlidesToShow = () => {
		if (isMobile) {
			return data.images?.length === 1 ? 1 : 2;
		}
		return data.images && data.images.length >= 5 ? 5 : data.images?.length;
	};

	const handleClose = () => {
		setSelectedImageIndex(null);
	};

	const handleClickImage = (i: number) => () => {
		setSelectedImageIndex(i);
	};
	const whyWeBestImages1 = page.whyWeBestImages.slice(0, 4);
	const whyWeBestImages2 = page.whyWeBestImages.slice(4, 8);

	const renderWhyWeBest = (images: IImage[]) => (
		<>
			{isMobile ? (
				<Box paddingX='1em' marginBottom='2em'>
					<Slider slidesToShow={1} autoplay autoplaySpeed={3000}>
						{images.map((image) => (
							<Box key={image.id}>
								<Image
									title={getStringByTemplateStr(image.caption, data)}
									alt={getStringByTemplateStr(image.alternativeText, data)}
									style={{ margin: 'auto' }}
									key={image.id}
									src={image.url}
									width={280}
									height={185}
								></Image>
							</Box>
						))}
					</Slider>
				</Box>
			) : (
				<Box display='flex' justifyContent='space-between' marginBottom='1em' flexWrap='wrap'>
					{images.map((image) => (
						<Image
							style={{ marginBottom: '2em' }}
							title={getStringByTemplateStr(image.caption, data)}
							alt={getStringByTemplateStr(image.alternativeText, data)}
							key={image.id}
							src={image.url}
							width={280}
							height={185}
						></Image>
					))}
				</Box>
			)}
		</>
	);

	return (
		<>
			<Box display='flex' marginTop='3em' gap={'2em'} sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
				<Box display='flex' sx={{ width: { xs: '100%', md: '570px' } }} maxHeight={isMobile ? 360 : 480}>
					{data.images ? (
						<>
							<Slider
								ref={(ref) => {
									setSliderSmall(ref);
								}}
								swipeToSlide
								verticalSwiping
								vertical
								arrows={false}
								slidesToShow={getSlidesToShow()}
								focusOnSelect
								className={classNames(
									styles.slider,
									styles.slider_small,
									isMobile && styles.slider_small_mobile
								)}
								asNavFor={sliderBig || undefined}
							>
								{data.images.map((item) => (
									<Box marginY='0.5em' key={item.id}>
										<Image
											title={item.caption}
											alt={item.alternativeText}
											width={104}
											height={78}
											src={item.formats?.thumbnail.url || item.url}
										></Image>
									</Box>
								))}
							</Slider>
							<Slider
								ref={(ref) => {
									setSliderBig(ref);
								}}
								asNavFor={sliderSmall || undefined}
								arrows={false}
								autoplay
								autoplaySpeed={5000}
								className={classNames(styles.slider, isMobile && styles.slider_mobile)}
							>
								{data.images.map((item, i) => (
									<Box
										onClick={handleClickImage(i)}
										sx={{ paddingX: { xs: '0.25em', md: '1em' } }}
										key={item.id}
									>
										<Image
											title={item.caption}
											// style={{ height: '100%' }}
											alt={item.alternativeText}
											width={440}
											height={isMobile ? 360 : 480}
											src={item.url}
										></Image>
									</Box>
								))}
							</Slider>
						</>
					) : (
						<Image
							title={data.name}
							alt={data.name}
							quality={100}
							width={540}
							height={480}
							style={{ objectFit: 'cover' }}
							src=''
						></Image>
					)}
				</Box>
				<Box flex='1'>
					<Typography variant='h4' fontWeight='500' title={data.h1} component='h1'>
						{data.h1}
					</Typography>
					<Box marginBottom='1em' alignItems='center' display='flex'>
						<Link marginRight='0.5em' variant='h6' href='tel:+375297804780'>
							+375 29 780 4 780
						</Link>
						<FavoriteButton product={data}></FavoriteButton>
					</Box>
					<Box display='flex' alignItems='center'>
						{!!data.discountPrice && (
							<Typography fontWeight='bold' variant='h4' marginRight='0.5em' color='secondary'>
								{data.discountPrice} руб{' '}
							</Typography>
						)}
						{!!data.discountPriceUSD && (
							<Typography color='text.primary'>~{data.discountPriceUSD.toFixed()}$</Typography>
						)}
					</Box>
					<Box display='flex' alignItems='center'>
						<Typography
							marginRight='0.5em'
							textAlign='center'
							fontWeight='bold'
							variant='h4'
							component={data.discountPrice ? 's' : 'p'}
							sx={{ opacity: data.discountPrice ? '0.8' : '1' }}
							color='secondary'
						>
							{data.price} руб{' '}
						</Typography>
						{!!data.priceUSD && <Typography color='text.secondary'>~{data.priceUSD.toFixed()}$</Typography>}
					</Box>

					<Table sx={{ marginY: '2em' }}>
						<TableBody>
							{printOptions.map((item) => (
								<TableRow key={item.value}>
									<TableCell sx={{ border: 'none', padding: '0.5em 0 0.5em 0' }} padding='none'>
										<Typography whiteSpace='nowrap' fontWeight='500'>
											{item.text}
										</Typography>
									</TableCell>
									<TableCell width='100%' sx={{ border: 'none', paddingLeft: '2em' }} padding='none'>
										<Typography>{item.value}</Typography>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<Button
						sx={{ padding: '0.5em 4em', fontSize: '1em', margin: '0 1em 0.5em 0' }}
						variant='contained'
						component='a'
						href='tel:+375297804780'
					>
						Позвонить
					</Button>
					{!sold && (
						<Buy
							onSold={handleSold}
							product={data}
							sx={{ padding: '0.5em 4em', fontSize: '1em', marginBottom: '0.5em' }}
						></Buy>
					)}
				</Box>
			</Box>
			<Typography withSeparator gutterBottom marginY='1em' component='h2' variant='h5' fontWeight='500'>
				{data.h1} характеристики
			</Typography>
			{page.textAfterDescription && <ReactMarkdown content={page.textAfterDescription}></ReactMarkdown>}
			<CarouselProducts
				sx={{ paddingX: { xs: '1em', md: '0' } }}
				data={relatedProducts}
				title={
					<Typography withSeparator fontWeight='500' marginBottom='1em' marginTop='1em' variant='h5'>
						ВАМ СТОИТ ОБРАТИТЬ ВНИМАНИЕ
					</Typography>
				}
			></CarouselProducts>
			<Typography
				withSeparator
				textTransform='uppercase'
				fontWeight='500'
				gutterBottom
				component='h3'
				marginBottom='1.5em'
				marginTop='1.5em'
				variant='h5'
			>
				Почему мы лучшие в своем деле?
			</Typography>
			{renderWhyWeBest(whyWeBestImages1)}
			<Typography
				withSeparator
				marginBottom='1.5em'
				textTransform='uppercase'
				fontWeight='500'
				component='h3'
				variant='h5'
			>
				Мы осуществляем доставку во все <br></br> населенные пункты беларуси
			</Typography>
			<Typography marginBottom='2em'>
				Наши Запчасти б/у вы можете заказать с доставкой. Идеальна наша доставка отлажена в следующих городах
				Беларуси - Гродно, Минск, Брест, Гомель, Могилев, Витебск. Так же мы сообщаем что работаем во всех
				городах и деревнях, просто доставка займет немного больше времени. Будьте уверены, мы приложим все силы,
				что бы ваш товар - {data.h1} был доставлен максимально быстро.
			</Typography>
			{renderWhyWeBest(whyWeBestImages2)}
			{brandText && <ReactMarkdown content={brandText}></ReactMarkdown>}
			<GalleryImages
				images={data.images}
				selectedIndex={selectedImageIndex}
				onClose={handleClose}
			></GalleryImages>
		</>
	);
};

export default Product;
