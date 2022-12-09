import { Box, Button, Link, Typography } from '@mui/material';
import { PageProduct } from 'api/pages/types';
import { Image as IImage, LinkWithImage as ILinkWithImage, Product as IProduct, ProductType } from 'api/types';
import classNames from 'classnames';
import CarouselProducts from 'components/CarouselProducts';
import FavoriteButton from 'components/FavoriteButton';
import Image from 'components/Image';
import LinkWithImage from 'components/LinkWithImage';
import ReactMarkdown from 'components/ReactMarkdown';
// import ShoppingCartButton from 'components/ShoppingCartButton';
import WhiteBox from 'components/WhiteBox';
import { FC, useState } from 'react';
import Slider from 'react-slick';
import { isWheel } from 'services/ProductService';
import styles from './product.module.scss';

interface Props {
	page: PageProduct;
	data: IProduct;
	relatedProducts: IProduct[];
	printOptions: { text: string; value?: string | number }[];
}

const Product: FC<Props> = ({ data, printOptions, page, relatedProducts }) => {
	const [sliderBig, setSliderBig] = useState<Slider | null>(null);
	const [sliderSmall, setSliderSmall] = useState<Slider | null>(null);
	return (
		<>
			<WhiteBox padding='2em'>
				<Box marginBottom='1em' display='flex' alignItems='baseline' justifyContent='space-between'>
					<Box flex='1'>
						<Typography variant='h4' flex='1' title={data.h1} component='h1'>
							{data.h1}
						</Typography>
						{data.snippets?.textAfterH1 && (
							<ReactMarkdown content={data.snippets.textAfterH1}></ReactMarkdown>
						)}
					</Box>
					<Box alignItems='center' display='flex'>
						<Link marginRight='0.5em' variant='h5' href='tel:+375297804780'>
							+375 29 780 4 780
						</Link>
						<FavoriteButton product={data}></FavoriteButton>
					</Box>
				</Box>
				<Box display='flex' sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
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
									className={styles.slider}
								>
									{data.images.map((item) => (
										<Image
											key={item.id}
											alt={item.alternativeText}
											width={640}
											height={480}
											src={item.url}
										></Image>
									))}
								</Slider>
								<Slider
									ref={(ref) => {
										setSliderSmall(ref);
									}}
									swipeToSlide
									slidesToShow={data.images.length >= 5 ? 5 : data.images.length}
									focusOnSelect
									className={classNames(styles.slider, styles.slider_small)}
									asNavFor={sliderBig || undefined}
								>
									{data.images.map((item) => (
										<Box key={item.id}>
											<Image
												style={{
													margin: 'auto',
												}}
												alt={item.alternativeText}
												width={104}
												height={78}
												src={item.formats?.thumbnail.url || item.url}
											></Image>
										</Box>
									))}
								</Slider>
							</Box>
						</>
					) : (
						<Image alt={data.name} width={104} height={78} src=''></Image>
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
						}}
					>
						<Box
							flex='1'
							sx={{
								padding: { xs: '0', md: '0 1em 0 3em' },
							}}
						>
							{printOptions.map((item) => (
								<Box display='flex' key={item.value}>
									<Typography
										mr='1em'
										width={isWheel(data) ? '110px' : '90px'}
										fontWeight='500'
										variant='subtitle1'
										component='span'
									>
										{item.text}:
									</Typography>
									<Typography component='span'>{item.value}</Typography>
								</Box>
							))}
							<Box marginBottom='0.5em' display='flex' alignItems='center'>
								<Typography
									fontWeight='bold'
									variant='body1'
									component={data.discountPrice ? 's' : 'p'}
									sx={{
										opacity: data.discountPrice ? '0.8' : '1',
									}}
									color='primary'
								>
									{data.price} руб{' '}
									{!!data.priceUSD && (
										<Typography color='text.secondary' component='sup'>
											(~{data.priceUSD.toFixed()}$)
										</Typography>
									)}
								</Typography>
								{data.discountPrice && (
									<Typography paddingLeft='0.5em' fontWeight='bold' variant='body1' color='primary'>
										{data.discountPrice} руб{' '}
										{!!data.discountPriceUSD && (
											<Typography color='text.primary' component='sup'>
												(~
												{data.discountPriceUSD.toFixed()}
												$)
											</Typography>
										)}
									</Typography>
								)}
							</Box>
							<Button variant='contained' component='a' href='tel:+375297804780'>
								Заказать
							</Button>
						</Box>
					</Box>
				</Box>
				{!!page.linksWithImages?.length && (
					<Box marginTop='2em' display='flex' justifyContent={'space-around'}>
						{page.linksWithImages.map((item) => (
							<LinkWithImage
								width={150}
								height={150}
								key={item.id}
								image={item.image}
								link={item.link}
							></LinkWithImage>
						))}
					</Box>
				)}
				<Typography marginTop='1em' component='h2' variant='h5'>
					{data.h1} характеристики
				</Typography>
				{page.textAfterDescription && <ReactMarkdown content={page.textAfterDescription}></ReactMarkdown>}
				{page.benefits && (
					<>
						<Typography component='h3' variant='h5'>
							Почему мы лучшие в своем деле?
						</Typography>
						<Box marginTop='2em' display='flex' justifyContent={'space-around'}>
							{page.benefits.map((item) => (
								<Box maxWidth={208} key={item.id}>
									<Image
										alt={item.alternativeText}
										width={150}
										height={150}
										src={item.formats?.thumbnail.url || item.url}
									></Image>
									<Typography component='p' marginY='1em' textAlign='center' variant='body1'>
										{item.caption}
									</Typography>
								</Box>
							))}
						</Box>
					</>
				)}
				<Typography variant='h5' component='h2'>
					Мы осуществляем доставку во все населенные пункты Беларуси
				</Typography>
				<Typography padding='1em 0' variant='body1'>
					Наши Запчасти б/у вы можете заказать с доставкой. Идеальна наша доставка отлажена в следующих
					городах Беларуси - Гродно, Минск, Брест, Гомель, Могилев, Витебск. Так же мы сообщаем что работаем
					во всех городах и деревнях, просто доставка займет немного больше времени. Будьте уверены, мы
					приложим все силы, что бы ваш товар - {data.h1 || data.name} был доставлен максимально быстро.
				</Typography>
			</WhiteBox>
			<CarouselProducts
				title={
					<>
						<Typography component='h2' marginBottom='1em' marginTop='1em' textAlign='center' variant='h5'>
							А ещё у нас есть для этого авто
						</Typography>
						<Typography textAlign='center' variant='body1' marginBottom='1em'>
							Предлагаем дополнительные запасные части для данной марки авто
						</Typography>
					</>
				}
				data={relatedProducts}
			></CarouselProducts>
		</>
	);
};

export default Product;