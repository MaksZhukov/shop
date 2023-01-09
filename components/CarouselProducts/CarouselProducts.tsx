import { Box, Link, useTheme } from '@mui/material';
import { Product } from 'api/types';
import Image from 'components/Image';
import Typography from 'components/Typography';
import WhiteBox from 'components/WhiteBox';
import NextLink from 'next/link';
import { FC, ReactNode } from 'react';
import Slider from 'react-slick';
import { getProductTypeSlug } from 'services/ProductService';
import styles from './CarouselProducts.module.scss';

interface Props {
	title?: ReactNode;
	slidesToShow?: number;
	data: Product[];
}

const CarouselProducts: FC<Props> = ({ title, data, slidesToShow = 4 }) => {
	const { breakpoints } = useTheme();

	return data.length ? (
		<Box paddingX='1.5em'>
			{title}
			<Slider
				autoplay
				autoplaySpeed={5000}
				className={styles.slider}
				infinite
				slidesToShow={data.length < slidesToShow ? data.length : slidesToShow}
				slidesToScroll={1}
				responsive={[
					{
						breakpoint: breakpoints.values.sm,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1,
							infinite: true,
						},
					},
					{
						breakpoint: breakpoints.values.md,
						settings: {
							slidesToShow: data.length < 2 ? data.length : 2,
							slidesToScroll: 1,
							infinite: true,
						},
					},
					{
						breakpoint: breakpoints.values.lg,
						settings: {
							slidesToShow: data.length < 3 ? data.length : 3,
							slidesToScroll: 1,
							infinite: true,
						},
					},
				]}
			>
				{data.map((item) => {
					return (
						<WhiteBox textAlign='center' className={styles.slider__item} key={item.id}>
							{item.images && item.images.some((image) => image.formats) ? (
								<Slider
									swipe={false}
									pauseOnHover
									arrows={false}
									autoplay
									className={styles['inner-slider']}
									autoplaySpeed={3000}
								>
									{item.images
										.filter((item) => item.formats)
										.map((image) => (
											<Image
												key={image.id}
												alt={image.alternativeText}
												src={image.formats?.thumbnail.url || image.url}
												width={200}
												height={150}
											/>
										))}
								</Slider>
							) : (
								<Image style={{ margin: 'auto' }} alt={item.name} src={''} width={200} height={150} />
							)}
							<Typography marginTop='1em' variant='h6' title={item.h1 || item.name} lineClamp={1}>
								<NextLink href={`/${getProductTypeSlug(item)}/` + item.slug}>
									<Link component='span' underline='hover'>
										{item.h1 || item.name}
									</Link>
								</NextLink>
							</Typography>
							<Box display='flex'>
								<Typography
									fontWeight='bold'
									variant='body1'
									component={item.discountPrice ? 's' : 'p'}
									sx={{ opacity: item.discountPrice ? '0.8' : '1' }}
									color='primary'
								>
									{item.price} руб{' '}
									{!!item.priceUSD && (
										<Typography color='text.secondary' component='sup'>
											(~{item.priceUSD.toFixed()}$)
										</Typography>
									)}
								</Typography>
								{!!item.discountPrice && (
									<Typography paddingLeft='0.5em' fontWeight='bold' variant='body1' color='primary'>
										{item.discountPrice} руб{' '}
										{!!item.discountPriceUSD && (
											<Typography color='text.primary' component='sup'>
												(~{item.discountPriceUSD.toFixed()}$)
											</Typography>
										)}
									</Typography>
								)}
							</Box>
						</WhiteBox>
					);
				})}
			</Slider>
		</Box>
	) : (
		<></>
	);
};

export default CarouselProducts;
