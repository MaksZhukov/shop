import { useCartStore } from 'entities/cart';
import { useSnackbar } from 'notistack';
import { CART_MAX_ITEMS } from 'entities/cart';
import type { Product } from 'entities/product';
import { useAddCartLogic, useRemoveCart } from 'features/cart';

export const useToggleCart = (product: Product) => {
	const cartStore = useCartStore();
	const { enqueueSnackbar } = useSnackbar();
	const addCart = useAddCartLogic();
	const removeCart = useRemoveCart();

	const cartItem = cartStore.items.find(
		(item) => item.product.id === product.id && item.product.type === product.type
	);
	const isInCart = !!cartItem;
	const isSold = product.sold;
	const isMaxCartItems = cartStore.items.length >= CART_MAX_ITEMS;

	const handleClickCart = async () => {
		if (isInCart && cartItem) {
			try {
				await removeCart(cartItem);
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
				await addCart({
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

	return {
		handleClickCart,
		isInCart,
		isSold,
		isMaxCartItems
	};
};
