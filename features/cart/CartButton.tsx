import { Button, Tooltip } from '@mui/material';
import type { Product } from 'entities/product';
import { observer } from 'mobx-react';
import { useToggleCart } from './useToggleCart';
import { FC } from 'react';
import { CART_MAX_ITEMS } from 'entities/cart';

interface CartButtonProps {
	product: Product;
	sx?: object;
}

export const CartButton: FC<CartButtonProps> = observer(({ product, sx }: CartButtonProps) => {
	const { handleClickCart, isInCart, isSold, isMaxCartItems } = useToggleCart(product);

	const button = (
		<Button
			disabled={isMaxCartItems || isSold}
			sx={sx}
			variant={isInCart ? 'outlined' : 'contained'}
			onClick={handleClickCart}
		>
			{isInCart ? 'В корзине' : isSold ? 'Продан' : 'Добавить в корзину'}
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
