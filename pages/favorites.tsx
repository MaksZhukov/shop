import { Container, List, ListItem, Divider, Link, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import classNames from 'classnames';
import FavoriteButton from 'components/FavoriteButton';
import Image from 'components/Image';
// import ShoppingCartButton from 'components/ShoppingCartButton';
import Typography from 'components/Typography';
import WhiteBox from 'components/WhiteBox';
import { observer } from 'mobx-react';
import Head from 'next/head';
import NextLink from 'next/link';
import { Fragment } from 'react';
import Slider from 'react-slick';
import { getPageProps } from 'services/PagePropsService';
import { getProductTypeSlug } from 'services/ProductService';
import { useStore } from 'store';
import styles from './favorites.module.scss';

const Favorites = () => {
	const store = useStore();
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	let items = store.favorites.items;
	return (
		<>
			<Head>
				<title>Избранные</title>
				<meta name='description' content='Избранные товары'></meta>
				<meta name='keywords' content='авто, ожидаемые авто, автомобили, ожидаемые автомобили' />
			</Head>
			<Container>
				<WhiteBox className={styles.favorites}>
					<Typography variant='h4' component='h1' textAlign='center'>
						Избранные
					</Typography>
					{items.length ? (
						<List>
							{items.map((item, index) => {
								return (
									<Fragment key={item.id}>
										<ListItem
											className={classNames(isMobile && styles.list__item_mobile)}
											key={item.id}
										>
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
															<Image
																src={`${
																	isMobile
																		? image.formats?.small?.url || image.url
																		: image.formats?.thumbnail?.url || image.url
																}`}
																alt={image.alternativeText}
																key={image.id}
																width={isMobile ? 500 : 150}
																height={isMobile ? 375 : 100}
															></Image>
														))}
												</Slider>
											) : (
												<Image
													src={''}
													alt={item.product.name}
													width={isMobile ? 500 : 150}
													height={isMobile ? 375 : 100}
												></Image>
											)}
											<Box flex='1' padding='1em'>
												<Typography
													lineClamp={1}
													title={item.product.h1}
													marginBottom='0.5em'
													variant='h5'
													component='h2'
												>
													<NextLink
														href={`/${getProductTypeSlug(item.product)}/${
															item.product.slug
														}`}
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
												{...(isMobile && {
													justifyContent: 'end',
												})}
											>
												<Box display='flex'>
													<Typography
														fontWeight='bold'
														variant='body1'
														component={item.product.discountPrice ? 's' : 'p'}
														sx={{
															opacity: item.product.discountPrice ? '0.8' : '1',
														}}
														color='primary'
													>
														{item.product.price} руб{' '}
														{!!item.product.priceUSD && (
															<Typography color='text.secondary' component='sup'>
																(~
																{item.product.priceUSD.toFixed()}
																$)
															</Typography>
														)}
													</Typography>
													{item.product.discountPrice && (
														<Typography
															paddingLeft='0.5em'
															fontWeight='bold'
															variant='body1'
															color='primary'
														>
															{item.product.discountPrice} руб{' '}
															{!!item.product.discountPriceUSD && (
																<Typography color='text.primary' component='sup'>
																	(~
																	{item.product.discountPriceUSD.toFixed()}
																	$)
																</Typography>
															)}
														</Typography>
													)}
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
					) : (
						<Typography variant='subtitle1' marginY='1em' textAlign='center'>
							У вас нет товаров в избранном, добавьте их из{' '}
							<NextLink href={'/'}>
								<Link component='span' textTransform={'uppercase'}>
									Каталога
								</Link>
							</NextLink>
						</Typography>
					)}
				</WhiteBox>
			</Container>
		</>
	);
};

export default observer(Favorites);

export const getStaticProps = getPageProps();
