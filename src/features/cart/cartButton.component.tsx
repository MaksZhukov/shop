import { Button, Tooltip } from '@mui/material';
import { reatomComponent } from '@reatom/react';
import { CART_MAX_ITEMS } from 'entities/cart';
import type { Product } from 'entities/product';
import { useDI } from './cart.di';

interface CartButtonProps {
	product: Product;
	sx?: object;
}

export const CartButton = reatomComponent<CartButtonProps>(({ product, sx }) => {
	const { cartStore, cartListService } = useDI();
	const isInCart = !!cartListService.findItem(product);
	const isMaxCartItems = cartStore.items.length >= CART_MAX_ITEMS;

	const button = (
		<Button
			disabled={isMaxCartItems || product.sold}
			sx={sx}
			variant={isInCart ? 'outlined' : 'contained'}
			onClick={() => cartListService.toggle(product)}
		>
			{isInCart ? 'В корзине' : product.sold ? 'Продан' : 'Добавить в корзину'}
		</Button>
	);
	return isMaxCartItems ? (
		<Tooltip title={`Достигнут лимит корзины (${CART_MAX_ITEMS} товаров)`} placement='top'>
			<span>{button}</span>
		</Tooltip>
	) : (
		button
	);
});
