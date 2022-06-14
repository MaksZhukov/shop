import { Alert, IconButton } from '@mui/material';
import { useStore } from 'store';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { addToShoppingCart, removeItemFromShoppingCart } from 'api/cart/cart';
import { observer } from 'mobx-react';

interface Props {
	productId: number;
}

const ShoppingCartButton = ({ productId }: Props) => {
	const store = useStore();
	const cartItem = store.cart.items.find(
		(item) => item.product.id === productId
	);
	const handleClick = async () => {
		try {
			if (cartItem) {
				await removeItemFromShoppingCart(cartItem.id);
				store.cart.removeCartItem(cartItem.id);
				store.notification.showMessage({
					content: (
						<Alert variant='filled'>
							Вы успешно удалили товар из корзины
						</Alert>
					),
				});
			} else {
				let {
					data: { data: shoppingCartItem },
				} = await addToShoppingCart(productId);
				store.cart.addCartItem(shoppingCartItem);
				store.notification.showMessage({
					content: (
						<Alert variant='filled'>
							Вы успешно добавили товар в корзину
						</Alert>
					),
				});
			}
		} catch (err) {}
	};
	return (
		<IconButton onClick={handleClick}>
			{cartItem ? (
				<ShoppingCartIcon color='primary'></ShoppingCartIcon>
			) : (
				<ShoppingCartOutlinedIcon color='primary'></ShoppingCartOutlinedIcon>
			)}
		</IconButton>
	);
};

export default observer(ShoppingCartButton);
