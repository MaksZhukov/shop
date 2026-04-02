import { useMemo, useState } from 'react';
import type { OrderRegistrationFormData } from '../types';
import { useUserStore } from 'entities/user';
import { useCartStore } from 'entities/cart';

export const useOrderRegistration = () => {
	const userStore = useUserStore();
	const cartStore = useCartStore();

	const [isOrdered, setIsOrdered] = useState(false);
	const shoppingCartItems = cartStore.items;
	const selectedItemIds = cartStore.selectedItemsForCheckout;
	const isLoading = cartStore.isLoading || !userStore.isInitialRequestDone;

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
		isOrdered,
		setIsOrdered,
		checkoutItems,
		totalAmount,
		isLoading,
		getButtonText
	};
};
