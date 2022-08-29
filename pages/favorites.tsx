import {
	Container,
	List,
	ListItem,
	Divider,
	Button,
	Link,
} from '@mui/material';
import { Box } from '@mui/system';
import EmptyImageIcon from 'components/EmptyImageIcon';
import FavoriteButton from 'components/FavoriteButton';
import ShoppingCartButton from 'components/ShoppingCartButton';
import Typography from 'components/Typography';
import WhiteBox from 'components/WhiteBox';
import { observer } from 'mobx-react';
import getConfig from 'next/config';
import Image from 'next/image';
import NextLink from 'next/link';
import { Fragment } from 'react';
import Slider from 'react-slick';
import { useStore } from 'store';
import styles from './favorites.module.scss';

const { publicRuntimeConfig } = getConfig();

const Favorites = () => {
	const store = useStore();
	let items = store.favorites.items;

	return (
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
									<ListItem key={item.id}>
										{item.product.images ? (
											<Slider
												className={styles.slider}
												arrows={false}
												autoplay
												pauseOnHover
												autoplaySpeed={3000}>
												{item.product.images.map(
													(image) => (
														<Image
															src={
																publicRuntimeConfig.backendUrl +
																image.formats
																	.thumbnail
																	.url
															}
															alt={
																item.product
																	.name
															}
															key={image.id}
															width={150}
															height={
																100
															}></Image>
													)
												)}
											</Slider>
										) : (
											<EmptyImageIcon></EmptyImageIcon>
										)}
										<Box flex='1' padding='1em'>
											<NextLink
												href={`/products/${item.product.slug}`}>
												<Typography
													lineClamp={1}
													sx={{ cursor: 'pointer' }}
													marginBottom='0.5em'
													variant='h5'
													component='h2'>
													<Link underline='hover'>
														{item.product.name}
													</Link>
												</Typography>
											</NextLink>
											<Typography
												lineClamp={2}
												color='text.secondary'
												className={styles.description}>
												{item.product.description}
											</Typography>
										</Box>
										<Box>
											<Typography
												textAlign='center'
												marginBottom='0.5em'
												color='primary'
												variant='h5'>
												{item.product.price} р.
											</Typography>
											<ShoppingCartButton
												product={
													item.product
												}></ShoppingCartButton>
											<FavoriteButton
												product={
													item.product
												}></FavoriteButton>
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
						<Link href='/'>
							<Button>каталога</Button>
						</Link>
					</Typography>
				)}
			</WhiteBox>
		</Container>
	);
};

export default observer(Favorites);
