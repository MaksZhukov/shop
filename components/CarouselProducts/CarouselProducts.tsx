import { Box, Link, useTheme } from '@mui/material';
import { Product } from 'api/types';
import EmptyImageIcon from 'components/EmptyImageIcon';
import Typography from 'components/Typography';
import WhiteBox from 'components/WhiteBox';
import getConfig from 'next/config';
import Image from 'next/image';
import NextLink from 'next/link';
import { useSnackbar } from 'notistack';
import { FC, ReactNode, useEffect, useState } from 'react';
import Slider from 'react-slick';
import { store } from 'store';
import styles from './CarouselProducts.module.scss';
const { publicRuntimeConfig } = getConfig();
const COUNT_DAYS_FOR_NEW_PRODUCT = 70;

interface Props {
	title: ReactNode;
	data: Product[];
}

const CarouselProducts: FC<Props> = ({ title, data }) => {
	const { breakpoints } = useTheme();
	const { enqueueSnackbar } = useSnackbar();

	return data.length ? (
		<Box paddingX='1em'>
			{title}
			<Slider
				autoplay
				autoplaySpeed={5000}
				className={styles.slider}
				infinite
				slidesToShow={data.length < 4 ? data.length : 4}
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
				]}>
				{data.map((item) => {
					return (
						<WhiteBox
							textAlign='center'
							className={styles.slider__item}
							key={item.id}>
							{item.images &&
							item.images.some((image) => image.formats) ? (
								<Slider
									pauseOnHover
									arrows={false}
									autoplay
									className={styles['inner-slider']}
									autoplaySpeed={3000}>
									{item.images
										.filter((item) => item.formats)
										.map((image) => (
											<Image
												key={image.id}
												alt={image.alternativeText}
												src={
													publicRuntimeConfig.backendLocalUrl +
													image.formats?.thumbnail.url
												}
												width={200}
												height={150}
											/>
										))}
								</Slider>
							) : (
								<EmptyImageIcon
									margin={'-30px 0 -40px'}
									size={225}></EmptyImageIcon>
							)}
							<Typography
								marginTop='1em'
								variant='h6'
								title={item.name}
								lineClamp={1}>
								<NextLink
									href={
										`/products/${item.type}/` + item.slug
									}>
									<Link component='span' underline='hover'>
										{item.name}
									</Link>
								</NextLink>
							</Typography>
							<Typography
								flex='1'
								fontWeight='bold'
								variant='body1'
								color='primary'>
								Цена: {item.price} руб{' '}
								{item.priceUSD && (
									<Typography
										color='text.secondary'
										component='sup'>
										(~{item.priceUSD.toFixed()}$)
									</Typography>
								)}
							</Typography>
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
