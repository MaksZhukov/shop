import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PhoneIcon from '@mui/icons-material/Phone';
import ShieldIcon from '@mui/icons-material/Shield';
import { Box, Button, IconButton, Table, TableBody, TableCell, TableRow, useMediaQuery } from '@mui/material';
import { Brand, ProductBrandTexts } from 'api/brands/types';
import {
	PageProduct,
	PageProductCabin,
	PageProductSparePart,
	PageProductTire,
	PageProductWheel
} from 'api/pages/types';
import { BrandTextComponent, LinkWithImage as ILinkWithImage, Product as IProduct } from 'api/types';
import classNames from 'classnames';
import Buy from 'components/Buy';
import CarouselProducts from 'components/CarouselProducts';
import FavoriteButton from 'components/FavoriteButton';
import GalleryImages from 'components/GalleryImages/GalleryImages';
import Image from 'components/Image';
import LinkWithImage from 'components/LinkWithImage/LinkWithImage';
import ReactMarkdown from 'components/ReactMarkdown';
import Typography from 'components/Typography';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { FC, useState } from 'react';
import Slider from 'react-slick';
import { isSparePart, isTire, isTireBrand } from 'services/ProductService';
import { getStringByTemplateStr } from 'services/StringService';
import styles from './product.module.scss';

const TYPE_TEXT = {
	sparePart: 'Запчасти',
	wheel: 'Диски',
	cabin: 'Салоны',
	tire: 'Шины'
};

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface Props {
	page: PageProduct & (PageProductCabin | PageProductSparePart | PageProductTire | PageProductWheel);
	data: IProduct;
	brands: Brand[];
	relatedProducts: IProduct[];
	printOptions: { text: string; value?: string | number }[];
}

const Product: FC<Props> = ({ data, printOptions, page, relatedProducts, brands }) => {
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
		const videoLinkPlus = isSparePart(data) && data.videoLink ? 1 : 0;
		if (isMobile) {
			return data.images?.length === 1 ? 1 + videoLinkPlus : 2 + videoLinkPlus;
		}
		return data.images && data.images.length >= 5 ? 4 + videoLinkPlus : (data.images?.length || 0) + videoLinkPlus;
	};

	const handleClose = () => {
		setSelectedImageIndex(null);
	};

	const handleClickImage = (i: number) => () => {
		setSelectedImageIndex(i);
	};
	const whyWeBest1 = page.whyWeBest.slice(0, 4);
	const whyWeBest2 = page.whyWeBest.slice(4, 8);

	const renderH1 = (device: 'mobile' | 'desktop') => (
		<Typography
			display={device === 'mobile' ? { xs: 'block', md: 'none' } : { xs: 'none', md: 'block' }}
			gutterBottom={device === 'desktop'}
			variant='h4'
			fontWeight='500'
			title={data.h1}
			component='h1'>
			{data.h1}
		</Typography>
	);

	const renderActionBtns = (
		<>
			<Button
				sx={{ padding: '0.5em 3em 0.5em 1.5em', fontSize: '1em', margin: '0 1em 0.5em 0' }}
				variant='contained'
				component='a'
				href='tel:+375297804780'>
				<PhoneIcon sx={{ marginRight: '0.5em' }}></PhoneIcon>
				Позвонить
			</Button>
			{!sold && (
				<Buy
					onSold={handleSold}
					products={[data]}
					sx={{ padding: '0.5em 1.5em', fontSize: '1em', marginBottom: '0.5em' }}></Buy>
			)}
		</>
	);

	const renderWhyWeBest = (items: ILinkWithImage[]) => (
		<>
			{isMobile ? (
				<Box paddingX='1em' marginBottom='2em'>
					<Slider slidesToShow={1} autoplay autoplaySpeed={3000}>
						{items.map((item) => (
							<Box key={item.id}>
								<LinkWithImage
									image={{
										...item.image,
										caption: getStringByTemplateStr(item.image.caption, data),
										alternativeText: getStringByTemplateStr(item.image.alternativeText, data)
									}}
									link={item.link}
									width={280}
									height={185}
									withoutTitle></LinkWithImage>
							</Box>
						))}
					</Slider>
				</Box>
			) : (
				<Box display='flex' justifyContent='space-between' marginBottom='1em' flexWrap='wrap'>
					{items.map((item) => (
						<LinkWithImage
							key={item.id}
							image={{
								...item.image,
								caption: getStringByTemplateStr(item.image.caption, data),
								alternativeText: getStringByTemplateStr(item.image.alternativeText, data)
							}}
							link={item.link}
							width={280}
							height={185}
							withoutTitle></LinkWithImage>
					))}
				</Box>
			)}
		</>
	);

	return (
		<>
			<Box display='flex' marginTop='3em' gap={'2em'} sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
				{renderH1('mobile')}
				<Box>
					<Box display='flex' sx={{ width: { xs: '100%', md: '570px' } }} maxHeight={isMobile ? 360 : 480}>
						{data.images ? (
							<>
								<Box>
									<Slider
										ref={(ref) => {
											setSliderSmall(ref);
										}}
										swipeToSlide
										verticalSwiping
										autoplay
										autoplaySpeed={5000}
										vertical
										arrows={false}
										slidesToShow={getSlidesToShow()}
										focusOnSelect
										className={classNames(
											styles.slider,
											styles.slider_small,
											isMobile && styles.slider_small_mobile
										)}
										asNavFor={sliderBig || undefined}>
										{data.images.map((item) => (
											<Box key={item.id}>
												<Image
													style={{ objectPosition: 'top' }}
													title={item.caption}
													alt={item.alternativeText}
													width={104}
													height={78}
													src={item.formats?.thumbnail.url || item.url}></Image>
											</Box>
										))}
										{isSparePart(data) && data.videoLink && (
											<Box>
												<Typography
													width={98}
													bgcolor='primary.main'
													height={98}
													display='flex'
													alignItems='center'
													justifyContent='center'>
													Видео
												</Typography>
											</Box>
										)}
									</Slider>
								</Box>
								<Slider
									ref={(ref) => {
										setSliderBig(ref);
									}}
									asNavFor={sliderSmall || undefined}
									arrows={false}
									className={classNames(styles.slider, isMobile && styles.slider_mobile)}>
									{data.images.map((item, i) => (
										<Box onClick={handleClickImage(i)} sx={{ paddingX: '0.25em' }} key={item.id}>
											<Image
												title={item.caption}
												// style={{ height: '100%' }}
												style={{
													objectPosition: 'top',
													...(isMobile ? { height: 'auto' } : {})
												}}
												alt={item.alternativeText}
												width={470}
												height={isMobile ? 360 : 480}
												src={item.url}></Image>
										</Box>
									))}
									{isSparePart(data) && data.videoLink && (
										<Box>
											<ReactPlayer
												controls
												onPlay={() => sliderSmall?.slickPause()}
												onPause={() => sliderSmall?.slickPlay()}
												onEnded={() => sliderSmall?.slickPlay()}
												style={{ height: '100%' }}
												width={'100%'}
												height={isMobile ? '100%' : 480}
												url={data.videoLink}></ReactPlayer>
										</Box>
									)}
								</Slider>
							</>
						) : (
							<Image
								title={data.name}
								alt={data.name}
								quality={100}
								width={540}
								height={isMobile ? 360 : 480}
								style={{ objectFit: 'cover', height: 'auto' }}
								src=''></Image>
						)}
					</Box>
				</Box>
				<Box flex='1'>
					{renderH1('desktop')}
					<Box display='flex' alignItems='center'>
						{!!data.discountPrice && (
							<>
								<Typography variant='h5'>Скидка:</Typography>
								<Typography fontWeight='bold' variant='h4' marginRight='0.5em' color='secondary'>
									{data.discountPrice} руб{' '}
								</Typography>
							</>
						)}
						{!!data.discountPriceUSD && (
							<Typography color='text.primary'>~{data.discountPriceUSD.toFixed()}$</Typography>
						)}
					</Box>

					<Box display='flex' alignItems='center' marginBottom={{ xs: '1em', md: '1em' }}>
						<Typography
							marginRight='0.5em'
							textAlign='center'
							fontWeight='bold'
							variant='h4'
							component={data.discountPrice ? 's' : 'p'}
							sx={{ opacity: data.discountPrice ? '0.8' : '1' }}
							color='secondary'>
							{data.price} руб{' '}
						</Typography>
						{!!data.priceUSD && <Typography color='text.secondary'>~{data.priceUSD.toFixed()}$</Typography>}
						<NextLink href={'/delivery'}>
							<IconButton>
								<LocalShippingIcon titleAccess='Доставка' color='primary'></LocalShippingIcon>
							</IconButton>
						</NextLink>
						<NextLink href='/guarantee'>
							<IconButton>
								<ShieldIcon titleAccess='Гарантия' color='primary'></ShieldIcon>
							</IconButton>
						</NextLink>
						<FavoriteButton product={data}></FavoriteButton>
					</Box>
					<Typography marginY='0.5em'>При покупке на нашем сайте вы получите скидку до 10%</Typography>
					{renderActionBtns}
					<Table sx={{ marginY: '1em' }}>
						<TableBody>
							{printOptions.map((item) => (
								<TableRow key={item.value}>
									<TableCell
										sx={{ border: 'none', padding: '0 0 1em 0', minWidth: '150px' }}
										padding='none'>
										<Typography whiteSpace={{ xs: 'initial', md: 'nowrap' }} fontWeight='500'>
											{item.text}
										</Typography>
									</TableCell>
									<TableCell
										width='100%'
										sx={{
											border: 'none',
											verticalAlign: 'baseline',
											paddingLeft: { xs: '0.5em', sm: '2em' },
											wordBreak: { xs: 'break-word', sm: 'initial' }
										}}
										padding='none'>
										<Typography>{item.value}</Typography>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>
			</Box>
			<Typography withSeparator gutterBottom marginY='1em' component='h2' variant='h5' fontWeight='500'>
				Описание
			</Typography>
			<Typography paddingLeft='35px'>{data.description}</Typography>
			<Box paddingLeft='35px'>
				<ReactMarkdown content={page.additionalDescription}></ReactMarkdown>
			</Box>

			<Typography withSeparator gutterBottom marginY='1em' component='h2' variant='h5' fontWeight='500'>
				Характеристики для {data.h1}
			</Typography>
			{page.textAfterDescription && (
				<Box paddingLeft='35px'>
					<ReactMarkdown content={page.textAfterDescription}></ReactMarkdown>
				</Box>
			)}
			<CarouselProducts
				sx={{ paddingX: { xs: '1em', md: '0' } }}
				data={relatedProducts}
				title={
					<Typography
						textTransform='uppercase'
						withSeparator
						fontWeight='500'
						marginBottom='1em'
						marginTop='1em'
						variant='h5'>
						ВАМ СТОИТ ОБРАТИТЬ ВНИМАНИЕ НА НАШИ {TYPE_TEXT[data.type]} ОТ {data.brand?.name}{' '}
						{!isTire(data) && data.model?.name}
					</Typography>
				}></CarouselProducts>
			<Typography
				withSeparator
				textTransform='uppercase'
				fontWeight='500'
				gutterBottom
				component='h3'
				marginBottom='1.5em'
				marginTop='1.5em'
				variant='h5'>
				Почему мы лучшие в своем деле?
			</Typography>
			{renderWhyWeBest(whyWeBest1)}
			<Typography
				withSeparator
				marginBottom='1.5em'
				textTransform='uppercase'
				fontWeight='500'
				component='h3'
				variant='h5'>
				Мы осуществляем доставку во все <br></br> населенные пункты беларуси
			</Typography>
			<Typography paddingLeft='35px' marginBottom='2em'>
				Наши {TYPE_TEXT[data.type]} б/у вы можете заказать с доставкой. Идеальна наша доставка отлажена в
				следующих городах Беларуси - Гродно, Минск, Брест, Гомель, Могилев, Витебск. Так же мы сообщаем что
				работаем во всех городах и деревнях, просто доставка займет немного больше времени. Будьте уверены, мы
				приложим все силы, что бы ваш товар - {data.h1} был доставлен максимально быстро.
			</Typography>
			{renderWhyWeBest(whyWeBest2)}
			{brandText && <ReactMarkdown content={brandText}></ReactMarkdown>}
			{!isTire(data) && (
				<Typography marginBottom='1em'>
					Продаем только оригинальные, качественные б/у детали для иномарок {data.brand?.name}{' '}
					{data.model?.name} без пробега по Беларуси. {TYPE_TEXT[data.type]} с гарантией до 30 дней Доставка
					по РБ в течение суток-двух, в зависимости от места расположения. Огромный каталог товаров запчастей
					на сайте! Выбирайте и заказывайте! У нас в ассортименте представлены автозапчасти б/у на все
					известные иномарки. Являясь первыми импортерами, мы предоставляем отличные цены поставляемых
					контрактных деталей. При заказе {data.h1} наша курьерская служба поможет организовать доставку во
					все населенные пункты нашей родины. Для постоянных клиентов предоставляем бонусы и скидки.
				</Typography>
			)}
			<Typography
				gutterBottom
				textTransform='uppercase'
				withSeparator
				component='h2'
				variant='h5'
				fontWeight='500'>
				наши эксперты всегда помогут подобрать вам нужные {TYPE_TEXT[data.type]}
			</Typography>
			<Typography paddingLeft='35px'>
				Не стоит экономить на безопасности и выбирать недорогие, но неизвестного производителя запчасти. Лучше
				всего выбирать оригинальные {TYPE_TEXT[data.type]} или качественные аналоги от известных производителей.
			</Typography>
			<GalleryImages
				images={data.images}
				selectedIndex={selectedImageIndex}
				onClose={handleClose}></GalleryImages>
		</>
	);
};

export default Product;
