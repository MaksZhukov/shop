import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PhoneIcon from '@mui/icons-material/Phone';
import ShieldIcon from '@mui/icons-material/Shield';
import { Button, Checkbox, Divider, IconButton, Link, List, ListItem, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import classNames from 'classnames';
import FavoriteButton from 'components/FavoriteButton';
import Image from 'components/Image';
// import ShoppingCartButton from 'components/ShoppingCartButton';
import { Product } from 'api/types';
import Buy from 'components/Buy/Buy';
import Loader from 'components/Loader/Loader';
import Typography from 'components/Typography';
import { observer } from 'mobx-react';
import Head from 'next/head';
import NextLink from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import Slider from 'react-slick';
import { getPageProps } from 'services/PagePropsService';
import { getProductTypeSlug } from 'services/ProductService';
import { useStore } from 'store';
import styles from './favorites.module.scss';

const Favorites = () => {
	const [selectedFavoritesIDs, setSelectedFavoritesIDs] = useState<number[]>([]);
	const store = useStore();
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	const items = store.favorites.items;
	const isLoading = store.favorites.isLoading;
	const handleSold = () => {
		store.favorites.removeFavorites(selectedFavoritesIDs);
	};

	useEffect(() => {
		setSelectedFavoritesIDs(items.map((item) => item.id));
	}, [items]);
	const handleChangeCheckbox = (id: number, checked: boolean) => () => {
		if (checked) {
			setSelectedFavoritesIDs(selectedFavoritesIDs.filter((item) => item !== id));
		} else {
			setSelectedFavoritesIDs([...selectedFavoritesIDs, id]);
		}
	};

	if (isLoading) {
		return (
			<Box paddingY='10em' position='relative'>
				<Loader></Loader>
			</Box>
		);
	}

	let totalPrice = selectedFavoritesIDs.reduce(
		(prev, curr) =>
			prev +
			(items.find((item) => item.id === curr)?.product.discountPrice ||
				items.find((item) => item.id === curr)?.product.price ||
				0),
		0
	);

	if (isLoading) {
		return (
			<Box paddingY='10em' position='relative'>
				<Loader></Loader>
			</Box>
		);
	}

	return (
		<>
			<Head>
				<title>Избранные</title>
				<meta name='description' content='Избранные товары'></meta>
				<meta name='keywords' content='авто, ожидаемые авто, автомобили, ожидаемые автомобили' />
			</Head>
			<Typography textTransform='uppercase' variant='h4' component='h1' gutterBottom textAlign='center'>
				Избранные
			</Typography>
			{!!items.length ? (
				<>
					<List>
						{items.map((item, index) => {
							return (
								<Fragment key={item.id}>
									<ListItem
										sx={{
											bgcolor: '#fff',
											paddingLeft: '0.5em',
											flexWrap: { xs: 'wrap', sm: 'initial' }
										}}
										className={classNames(isMobile && styles.list__item_mobile)}
										key={item.id}
									>
										<Box display='flex' width={{ xs: '100%', sm: 'initial' }}>
											<Checkbox
												onChange={handleChangeCheckbox(
													item.id,
													selectedFavoritesIDs.includes(item.id)
												)}
												checked={selectedFavoritesIDs.includes(item.id)}
											></Checkbox>
											{item.product.images &&
											item.product.images.some((image) => image.formats) ? (
												<Slider
													className={classNames(
														styles.slider,
														isMobile && styles.slider_mobile
													)}
													arrows={false}
													autoplay
													pauseOnHover
													autoplaySpeed={3000}
												>
													{item.product.images
														.filter((item) => item.formats)
														.map((image) => (
															<Box key={image.id}>
																<Image
																	title={image?.caption}
																	src={`${
																		isMobile
																			? image.formats?.small?.url || image.url
																			: image.formats?.thumbnail?.url || image.url
																	}`}
																	// style={isMobile ? { height: 'auto' } : {}}
																	alt={image.alternativeText}
																	width={isMobile ? 500 : 150}
																	height={isMobile ? 250 : 100}
																></Image>
															</Box>
														))}
												</Slider>
											) : (
												<Image
													title={item.product.name}
													src={''}
													style={{ width: '100%' }}
													alt={item.product.name}
													width={isMobile ? 500 : 150}
													height={isMobile ? 250 : 100}
												></Image>
											)}
										</Box>
										<Box
											flex='1'
											width={{ xs: '100%', sm: 'initial' }}
											flexWrap={{ xs: 'wrap', sm: 'initial' }}
											padding='1em'
										>
											<Typography
												lineClamp={isMobile ? 5 : 2}
												title={item.product.h1}
												marginBottom='0.5em'
												variant='h5'
												component='h2'
											>
												<NextLink
													href={`/${getProductTypeSlug(item.product)}/${item.product.slug}`}
												>
													<Link component='span' underline='hover'>
														{item.product.h1}
													</Link>
												</NextLink>
											</Typography>
											{item.product.description && (
												<Typography
													lineClamp={2}
													color='text.secondary'
													className={styles.description}
												>
													{item.product.description}
												</Typography>
											)}
										</Box>
										<Box
											display={isMobile ? 'flex' : 'block'}
											width={{ xs: '100%', sm: 'initial' }}
											{...(isMobile && {
												justifyContent: 'end'
											})}
										>
											<Box display='flex'>
												<Box display='flex' marginRight='1em' alignItems='center'>
													{!!item.product.discountPrice && (
														<Typography
															fontWeight='bold'
															variant='h4'
															marginRight='0.5em'
															color='secondary'
														>
															{item.product.discountPrice} руб{' '}
														</Typography>
													)}
													{!!item.product.discountPriceUSD && (
														<Typography color='text.primary'>
															~{item.product.discountPriceUSD.toFixed()}$
														</Typography>
													)}
												</Box>
												<Box display='flex' alignItems='center'>
													<Typography
														marginRight='0.5em'
														textAlign='center'
														fontWeight='bold'
														variant='h4'
														component={item.product.discountPrice ? 's' : 'p'}
														sx={{ opacity: item.product.discountPrice ? '0.8' : '1' }}
														color='secondary'
													>
														{item.product.price} руб{' '}
													</Typography>
													{!!item.product.priceUSD && (
														<Typography mr='0.25em' color='text.secondary'>
															~{item.product.priceUSD.toFixed()}$
														</Typography>
													)}
													{!!item.product.priceRUB && (
														<Typography color='text.secondary'>
															~{item.product.priceRUB.toFixed()}₽
														</Typography>
													)}
												</Box>
											</Box>
											<Box textAlign='right'>
												{/* <ShoppingCartButton
														product={
															item.product
														}></ShoppingCartButton> */}
												<FavoriteButton product={item.product}></FavoriteButton>
											</Box>
										</Box>
									</ListItem>
									{index !== items.length - 1 && <Divider light></Divider>}
								</Fragment>
							);
						})}
					</List>
					<Box display='flex' alignItems={{ xs: 'initial', md: 'center' }} gap={{ xs: 0, sm: '1em' }}>
						<Box
							marginLeft={{ xs: 0, md: '150px' }}
							flex='1'
							flexWrap='wrap'
							display='flex'
							justifyContent={{ xs: 'initial', md: 'center' }}
							gap={{ xs: '0.25em', md: '1em' }}
						>
							<Buy
								onSold={handleSold}
								products={selectedFavoritesIDs.map(
									(id) => items.find((item) => item.id === id)?.product as Product
								)}
							></Buy>
							<Button variant='contained' component='a' href='tel:+375297804780'>
								<PhoneIcon sx={{ marginRight: '0.5em' }}></PhoneIcon>
								Позвонить
							</Button>
							<Box>
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
							</Box>
						</Box>
						<Typography width='150px' textAlign='center' variant='h6'>
							Итого: {totalPrice} руб
						</Typography>
					</Box>
				</>
			) : (
				<Typography variant='subtitle1' marginY='1em' textAlign='center'>
					У вас нет товаров в избранном, добавьте их из{' '}
					<NextLink href={'/'}>
						<Link component='span' textTransform={'uppercase'}>
							Магазина
						</Link>
					</NextLink>
				</Typography>
			)}
		</>
	);
};

export default observer(Favorites);

export const getStaticProps = getPageProps();
