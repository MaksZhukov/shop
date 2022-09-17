import { Alert, IconButton } from '@mui/material';
import { useStore } from 'store';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { observer } from 'mobx-react';
import { Product } from 'api/types';

interface Props {
	product: Product;
}

const ShoppingCartButton = ({ product }: Props) => {
	const store = useStore();
	const cartItem = store.cart.items.find(
		(item) => item.product.id === product.id
	);

	const handleClick = async () => {
		try {
			if (cartItem) {
				await store.cart.removeCartItem(cartItem);
				store.notification.showMessage({
					content: (
						<Alert variant='filled'>
							Вы успешно удалили товар из корзины
						</Alert>
					),
				});
			} else {
				await store.cart.addCartItem({
					id: new Date().getTime(),
					product,
				});
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
