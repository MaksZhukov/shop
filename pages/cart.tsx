import { Box, Checkbox, IconButton, Typography, useTheme } from '@mui/material';
import { Button, Carousel, Link, WhiteBox, Loader } from 'components/ui';
import { NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';
import { ViewedProducts } from 'components/features/ViewedProducts';
import { useRouter } from 'next/router';
import { useStore } from 'store';
import { observer } from 'mobx-react';
import { TrashIcon } from 'components/icons';
import { AnyQuestionsLeft } from 'components/features/AnyQuestionsLeft';
import { useState, useMemo, useEffect } from 'react';

import { isSparePart } from 'services/ProductService';
import NextImage from 'next/image';
import FavoriteButton from 'components/features/FavoriteButton';
import { ProductPrice } from 'components/features/ProductPrice';
import { ProductItemImages } from 'components/features/ProductItemImages';
interface Props {}

const Cart: NextPage<Props> = observer(() => {
	const router = useRouter();
	const handleStartShopping = () => {
		router.push('/spare-parts');
	};
	const store = useStore();
	const shoppingCartItems = store.shoppingCart.items;
	const isLoading = store.shoppingCart.isLoading || !store.isInitialRequestDone;
	const [selectedItems, setSelectedItems] = useState<number[]>([]);

	const theme = useTheme();

	const allSelected = useMemo(() => {
		return shoppingCartItems.length > 0 && shoppingCartItems.every((item) => selectedItems.includes(item.id));
	}, [shoppingCartItems, selectedItems]);

	const handleSelectAll = () => {
		if (allSelected) {
			setSelectedItems([]);
		} else {
			setSelectedItems(shoppingCartItems.map((item) => item.id));
		}
	};

	const handleToggleItem = (itemId: number) => {
		setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
	};

	const handleDeleteSelected = async () => {
		if (selectedItems.length > 0) {
			await store.shoppingCart.removeFromShoppingCartMany(selectedItems);
			setSelectedItems([]);
		}
	};

	const selectedCartItems = useMemo(() => {
		return shoppingCartItems.filter((item) => selectedItems.includes(item.id));
	}, [shoppingCartItems, selectedItems]);

	const selectedTotal = useMemo(() => {
		return selectedCartItems.reduce((acc, item) => acc + (item.product.discountPrice || item.product.price), 0);
	}, [selectedCartItems]);

	useEffect(() => {
		setSelectedItems((prev) => prev.filter((id) => shoppingCartItems.some((item) => item.id === id)));
	}, [shoppingCartItems]);

	const renderEmptyCart = () => {
		return (
			<Box py={5} display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
				<NextImage src='/basket.png' alt='Корзина' width={144} height={136} />
				<Typography variant='h6' fontSize='18px' mt={2}>
					В корзине пока пусто
				</Typography>
				<Typography mb={2} variant='body1'>
					Воспользуйтесь поиском, чтобы найти всё, что вам нужно
				</Typography>
				<Button variant='contained' color='primary' onClick={handleStartShopping}>
					Начать покупки
				</Button>
			</Box>
		);
	};

	const renderFilledCart = () => {
		return (
			<>
				<Typography variant='h6' component='h1' mb={2}>
					Корзина
				</Typography>
				<Box display='flex' gap={1}>
					<Box flex={1}>
						<WhiteBox
							display='flex'
							justifyContent='space-between'
							alignItems='center'
							mb={2}
							py={1.5}
							px={1}
							bgcolor='white'
							borderRadius={4}
						>
							<Box display='flex' alignItems='center' gap={1}>
								<Checkbox checked={allSelected} onChange={handleSelectAll} />
								<Typography variant='body1'>Выбрать все</Typography>
							</Box>
							<IconButton
								onClick={handleDeleteSelected}
								disabled={selectedItems.length === 0}
								size='large'
								sx={{
									color: 'secondary.main',
									bgcolor: '#00000029',
									borderRadius: 1.5,
									'&:hover': { bgcolor: '#00000050' },
									'&:disabled': { opacity: 0.5 }
								}}
							>
								<TrashIcon />
							</IconButton>
						</WhiteBox>
						<Box>
							{shoppingCartItems.map((item) => (
								<WhiteBox key={item.id} mb={1} p={2}>
									<Box display='flex' gap={1} position='relative'>
										<Box overflow='hidden' borderRadius={2} width={136} height={108}>
											<Box position='absolute' bgcolor='white' zIndex={1} left={0} top={0}>
												<Checkbox
													sx={{ padding: 0 }}
													checked={selectedItems.includes(item.id)}
													onChange={() => handleToggleItem(item.id)}
												/>
											</Box>
											<ProductItemImages
												data={item.product}
												width={136}
												imageHeight={108}
												imageHeightOffset={0}
											/>
										</Box>
										<Box
											flex={1}
											display='flex'
											flexDirection='column'
											justifyContent='space-between'
										>
											<Box>
												<Link
													href={`/spare-parts/${item.product.brand?.slug}/${item.product.id}`}
												>
													{item.product.h1}
												</Link>
												<Typography mb={1} color='custom.text-muted'>
													{isSparePart(item.product) &&
														[
															item.product.volume?.name,
															item.product.fuel,
															item.product.transmission,
															item.product.year
														]
															.filter(Boolean)
															.join(', ')}
												</Typography>
											</Box>
											<Box display='flex' alignItems='center'>
												<FavoriteButton product={item.product} />
												<IconButton
													size='large'
													onClick={() => {
														store.shoppingCart.removeFromShoppingCart(item);
													}}
												>
													<TrashIcon width={18} height={20} />
												</IconButton>
												<Button sx={{ ml: 1 }} variant='outlined' size='small'>
													Купить
												</Button>
											</Box>
										</Box>
										<ProductPrice data={item.product} withPercentage={false} />
									</Box>
								</WhiteBox>
							))}
						</Box>
					</Box>
					<Box display='flex' maxWidth='400px' gap={1} flexDirection='column'>
						<WhiteBox>
							<Box p={2} borderBottom={`1px solid ${theme.palette.custom.divider}`}>
								<Button
									size='large'
									variant='contained'
									color='primary'
									fullWidth
									disabled={selectedItems.length === 0}
								>
									Перейти к оформлению
								</Button>
								<Typography mt={0.5} textAlign='center' variant='body1' color='custom.text-muted'>
									Доступные способы и условия доставки можно узнать при оформлении заказа
								</Typography>
							</Box>
							<Box p={1.5}>
								<Box display='flex' gap={1} mb={0.5}>
									<Typography flex={1} variant='body1' color='custom.text-muted'>
										Всего:
									</Typography>
									<Typography variant='body1' color='custom.text-muted'>
										{selectedCartItems.length} шт.
									</Typography>
								</Box>
								<Box display='flex' gap={1}>
									<Typography flex={1} variant='h6' fontWeight={500} fontSize='16px'>
										Сумма заказа:
									</Typography>
									<Typography variant='h6'>{selectedTotal} руб.</Typography>
								</Box>
							</Box>
						</WhiteBox>
						<AnyQuestionsLeft />
					</Box>
				</Box>
			</>
		);
	};

	if (isLoading) {
		return <Loader />;
	}

	return (
		<Box py={2}>
			{shoppingCartItems.length === 0 ? renderEmptyCart() : renderFilledCart()}
			<ViewedProducts />
		</Box>
	);
});

export default Cart;

export const getStaticProps = getPageProps(undefined, async () => ({
	props: {
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: 'Корзина', href: '/cart' }
		]
	}
}));
