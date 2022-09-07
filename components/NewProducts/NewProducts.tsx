import { Box, Link, useTheme } from '@mui/material';
import { fetchProducts } from 'api/products/products';
import { Product } from 'api/products/types';
import EmptyImageIcon from 'components/EmptyImageIcon';
import Typography from 'components/Typography';
import WhiteBox from 'components/WhiteBox';
import getConfig from 'next/config';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import styles from './NewProducts.module.scss';
const { publicRuntimeConfig } = getConfig();
const COUNT_DAYS_FOR_NEW_PRODUCT = 7;

const NewProducts = () => {
	const [data, setData] = useState<Product[]>([]);
	const router = useRouter();
	const { breakpoints } = useTheme();

	useEffect(() => {
		let date = new Date();
		const fetchNewProducts = async () => {
			const {
				data: { data },
			} = await fetchProducts({
				sort: 'createdAt:desc',
				populate: ['images'],
				filters: {
					createdAt: {
						$gte: date.setDate(
							date.getDate() - COUNT_DAYS_FOR_NEW_PRODUCT
						),
					},
				},
			});
			setData(data);
		};
		fetchNewProducts();
	}, []);

	const handleClickMore = (slug: string) => () => {
		router.push('/products/' + slug);
	};

	return data.length ? (
		<Box paddingX='1em'>
			<Typography
				marginBottom='1em'
				marginTop='1em'
				textAlign='center'
				variant='h5'>
				Новые запчасти
			</Typography>
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
												alt={item.name}
												src={
													publicRuntimeConfig.backendUrl +
													image.formats?.thumbnail.url
												}
												width={200}
												height={150}
											/>
										))}
								</Slider>
							) : (
								<EmptyImageIcon
									margin={'-45px -25px -55px'}
									size={250}></EmptyImageIcon>
							)}
							<Typography
								onClick={handleClickMore(item.slug)}
								marginTop='1em'
								variant='h6'
								title={item.name}
								lineClamp={1}>
								<Link underline='hover'>{item.name}</Link>
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

export default NewProducts;
