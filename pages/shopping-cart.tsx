import {
	Box,
	Button,
	Divider,
	ListItem,
	List,
	Link,
	useMediaQuery,
} from '@mui/material';
import { Container } from '@mui/system';
import { SparePart } from 'api/spareParts/types';
import classNames from 'classnames';
import CheckoutForm from 'components/CheckoutForm';
import EmptyImageIcon from 'components/EmptyImageIcon';
import FavoriteButton from 'components/FavoriteButton';
import ShoppingCartButton from 'components/ShoppingCartButton';
import Typography from 'components/Typography';
import WhiteBox from 'components/WhiteBox';
import { observer } from 'mobx-react';
import getConfig from 'next/config';
import Head from 'next/head';
import Image from 'next/image';
import NextLink from 'next/link';
import { Fragment, useState } from 'react';
import Slider from 'react-slick';
import { isSparePart } from 'services/ProductService';
import { useStore } from 'store';
import styles from './shopping-cart.module.scss';

const { publicRuntimeConfig } = getConfig();

const ShoppingCart = () => {
	const [isCheckoutFormOpened, setIsCheckoutFormOpened] =
		useState<boolean>(false);
	const isMobile = useMediaQuery((theme: any) =>
		theme.breakpoints.down('sm')
	);
	const store = useStore();
	let items = store.cart.items;

	const handleClick = () => {
		setIsCheckoutFormOpened(true);
	};

	return (
		<>
			<Head>
				<title>Корзина</title>
				<meta name='description' content='Корзина товаров'></meta>
			</Head>
			<Container>
				<WhiteBox>
					<Typography variant='h4' component='h1' textAlign='center'>
						Корзина
					</Typography>
					{items.length ? (
						<>
							<List>
								{items.map((item, index) => {
									return (
										<Fragment key={item.id}>
											<ListItem
												className={classNames(
													isMobile &&
														styles.list__item_mobile
												)}
												key={item.id}>
												{item.product.images &&
												item.product.images.some(
													(image) => image.formats
												) ? (
													<Slider
														className={classNames(
															styles.slider,
															isMobile &&
																styles.slider_mobile
														)}
														autoplay
														autoplaySpeed={3000}
														arrows={false}
														pauseOnHover>
														{item.product.images
															.filter(
																(item) =>
																	item.formats
															)
															.map((image) => (
																<Image
																	src={
																		publicRuntimeConfig.backendLocalUrl +
																		`${
																			isMobile
																				? image
																						.formats
																						?.small
																						.url
																				: image
																						.formats
																						?.thumbnail
																						.url
																		}`
																	}
																	alt={
																		item
																			.product
																			.name
																	}
																	width={
																		isMobile
																			? 500
																			: 150
																	}
																	height={
																		isMobile
																			? 375
																			: 100
																	}
																	key={
																		image.id
																	}></Image>
															))}
													</Slider>
												) : (
													<EmptyImageIcon></EmptyImageIcon>
												)}
												<Box flex='1' padding='1em'>
													<Typography
														lineClamp={1}
														marginBottom='0.5em'
														variant='h5'
														component='h2'>
														<NextLink
															href={`/products/${item.product.type}/${item.product.slug}`}
															passHref>
															<Link underline='hover'>
																{
																	item.product
																		.name
																}
															</Link>
														</NextLink>
													</Typography>

													{isSparePart(
														item.product
													) && (
														<Typography
															lineClamp={2}
															color='text.secondary'
															className={
																styles.description
															}>
															{
																item.product
																	.description
															}
														</Typography>
													)}
												</Box>
												<Box
													display={
														isMobile
															? 'flex'
															: 'block'
													}
													{...(isMobile && {
														justifyContent: 'end',
													})}>
													<Typography
														textAlign='center'
														marginBottom='0.5em'
														color='primary'
														variant='h5'>
														{item.product.price}{' '}
														руб.
														{!!item.product
															.priceUSD && (
															<Typography
																color='text.secondary'
																component='sup'>
																(~
																{item.product.priceUSD.toFixed()}
																$)
															</Typography>
														)}
													</Typography>
													<Box textAlign='right'>
														<ShoppingCartButton
															product={
																item.product
															}></ShoppingCartButton>
														<FavoriteButton
															product={
																item.product
															}></FavoriteButton>
													</Box>
												</Box>
											</ListItem>
											{index !== items.length - 1 && (
												<Divider light></Divider>
											)}
										</Fragment>
									);
								})}
							</List>
							{!isCheckoutFormOpened ? (
								<Button
									onClick={handleClick}
									variant='contained'>
									Перейти к оформлению заказа
								</Button>
							) : (
								<CheckoutForm></CheckoutForm>
							)}
						</>
					) : (
						<Typography
							variant='subtitle1'
							marginY='1em'
							textAlign='center'>
							У вас нет товаров в корзине, добавьте их из
							<Link href='/'>
								<Button>каталога</Button>
							</Link>
						</Typography>
					)}
				</WhiteBox>
			</Container>
		</>
	);
};

export default observer(ShoppingCart);

export async function getStaticProps() {
	return { props: {} };
}
