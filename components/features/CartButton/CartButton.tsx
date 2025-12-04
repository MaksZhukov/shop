import { Button, Tooltip } from '@mui/material';
import { API_MAX_CART_ITEMS } from 'api/constants';
import { Product } from 'api/types';
import { observer } from 'mobx-react';
import { useSnackbar } from 'notistack';
import { useStore } from 'store';

interface Props {
	product: Product;
	sx?: object;
}

export const CartButton = observer(({ product, sx }: Props) => {
	const store = useStore();
	const { enqueueSnackbar } = useSnackbar();
	const cartItem = store.shoppingCart.items.find(
		(item) => item.product.id === product.id && item.product.type === product.type
	);
	const isInCart = !!cartItem;
	const isMaxCartItems = store.shoppingCart.items.length >= API_MAX_CART_ITEMS;

	const handleClick = async () => {
		if (isInCart && cartItem) {
			try {
				await store.shoppingCart.removeFromShoppingCart(cartItem);
				enqueueSnackbar('Вы успешно удалили товар из корзины', {
					variant: 'success'
				});
			} catch (err) {
				enqueueSnackbar('Произошла какая-то ошибка с удалением из корзины, обратитесь в поддержку', {
					variant: 'error'
				});
			}
		} else {
			try {
				await store.shoppingCart.addToShoppingCart({
					id: new Date().getTime(),
					product
				});
				enqueueSnackbar('Вы успешно добавили товар в корзину', {
					variant: 'success'
				});
			} catch (err) {
				enqueueSnackbar('Произошла какая-то ошибка с добавлением в корзину, обратитесь в поддержку', {
					variant: 'error'
				});
			}
		}
	};

	const button = (
		<Button disabled={isMaxCartItems} sx={sx} variant={isInCart ? 'outlined' : 'contained'} onClick={handleClick}>
			{isInCart ? 'В корзине' : 'Добавить в корзину'}
		</Button>
	);
	return isMaxCartItems ? (
		<Tooltip title={`Достигнут лимит корзины (${API_MAX_CART_ITEMS} товаров)`} placement='top'>
			<span>{button}</span>
		</Tooltip>
	) : (
		button
	);
});
