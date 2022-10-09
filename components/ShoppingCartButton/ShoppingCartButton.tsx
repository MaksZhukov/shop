import { Alert, IconButton } from '@mui/material';
import { useStore } from 'store';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { observer } from 'mobx-react';
import { Product } from 'api/types';
import { useSnackbar } from 'notistack';

interface Props {
	product: Product;
}

const ShoppingCartButton = ({ product }: Props) => {
	const store = useStore();
	const { enqueueSnackbar } = useSnackbar();
	console.log(store.cart.items);
	const cartItem = store.cart.items.find(
		(item) => item.product.id === product.id
	);

	const handleClick = async () => {
		try {
			if (cartItem) {
				try {
					await store.cart.removeCartItem(cartItem);
					enqueueSnackbar('Вы успешно удалили товар из корзины', {
						variant: 'success',
					});
				} catch (err) {
					enqueueSnackbar(
						'Произошла какая-то ошибка при удалении из корзины, обратитесь в поддержку',
						{ variant: 'error' }
					);
				}
			} else {
				try {
					await store.cart.addCartItem({
						id: new Date().getTime(),
						uid: new Date().getTime().toString(),
						product,
					});
					enqueueSnackbar('Вы успешно добавили товар в корзину', {
						variant: 'success',
					});
				} catch (err) {
					enqueueSnackbar(
						'Произошла какая-то ошибка при добавлении в корзину, обратитесь в поддержку',
						{ variant: 'error' }
					);
				}
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
