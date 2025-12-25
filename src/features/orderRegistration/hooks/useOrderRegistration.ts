import { useMemo } from 'react';
import { useStore } from 'app/providers/StoreProvider';
import type { OrderRegistrationFormData } from '../types';

export const useOrderRegistration = () => {
	const store = useStore();
	const shoppingCartItems = store.cart.items;
	const selectedItemIds = store.cart.selectedItemsForCheckout;
	const isLoading = store.cart.isLoading || !store.isInitialRequestDone;

	const checkoutItems = useMemo(
		() => shoppingCartItems.filter((item) => !item.product.sold && selectedItemIds.includes(item.id)),
		[shoppingCartItems, selectedItemIds]
	);

	const totalAmount = useMemo(
		() => checkoutItems.reduce((acc, item) => acc + (item.product.discountPrice || item.product.price), 0),
		[checkoutItems]
	);

	const getButtonText = (paymentMethod: OrderRegistrationFormData['paymentMethod']) => {
		switch (paymentMethod) {
			case 'online':
				return 'Оплатить онлайн';
			case 'cash':
				return 'Оформить заказ';
			case 'bank_transfer':
				return 'Оформить заказ';
			case 'pickup':
				return 'Оформить заказ';
			default:
				return 'Перейти к оформлению';
		}
	};

	return {
		checkoutItems,
		totalAmount,
		isLoading,
		getButtonText
	};
};
