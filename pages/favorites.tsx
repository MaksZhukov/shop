import {
	Container,
	List,
	ListItem,
	Divider,
	Button,
	Link,
	useMediaQuery,
} from '@mui/material';
import { Box } from '@mui/system';
import { SparePart } from 'api/spareParts/types';
import classNames from 'classnames';
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
import { Fragment } from 'react';
import Slider from 'react-slick';
import { useStore } from 'store';
import styles from './favorites.module.scss';

const { publicRuntimeConfig } = getConfig();

const Favorites = () => {
	const store = useStore();
	const isMobile = useMediaQuery((theme: any) =>
		theme.breakpoints.down('sm')
	);
	let items = store.favorites.items;

	return (
		<>
			<Head>
				<title>Избранные</title>
				<meta name='description' content='Избранные товары'></meta>
				<meta
					name='keywords'
					content='авто, ожидаемые авто, автомобили, ожидаемые автомобили'
				/>
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
													arrows={false}
													autoplay
													pauseOnHover
													autoplaySpeed={3000}>
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
																					?.small?.url || image.url 
																			: image
																					.formats
																					?.thumbnail?.url || image.url
																	}`
																}
																alt={
																	item.product
																		.name
																}
																key={image.id}
																width={
																	isMobile
																		? 500
																		: 150
																}
																height={
																	isMobile
																		? 375
																		: 100
																}></Image>
														))}
												</Slider>
											) : (
												<EmptyImageIcon></EmptyImageIcon>
											)}
											<Box flex='1' padding='1em'>
												<Typography
													lineClamp={1}
													title={item.product.name}
													marginBottom='0.5em'
													variant='h5'
													component='h2'>
													<NextLink
														href={`/products/${item.product.type}/${item.product.slug}`}
														passHref>
														<Link underline='hover'>
															{item.product.name}
														</Link>
													</NextLink>
												</Typography>
												{item.product.description && (
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
													isMobile ? 'flex' : 'block'
												}
												{...(isMobile && {
													justifyContent: 'end',
												})}>
												<Typography
													textAlign='center'
													marginBottom='0.5em'
													color='primary'
													variant='h5'>
													{item.product.price} руб.
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
					) : (
						<Typography
							variant='subtitle1'
							marginY='1em'
							textAlign='center'>
							У вас нет товаров в избранном, добавьте их из
							<NextLink href={'/'} passHref>
								<Link textTransform={'uppercase'}>
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

export async function getStaticProps() {
	return { props: {} };
}
