import { useState, useEffect } from 'react';
import router from 'next/router';
import { orderApi, type OrderCheckoutResponse } from 'entities/order';
import { useOrderTimer } from './useOrderTimer';
import { useRemoveCartMany } from 'features/cart/useRemoveCartMany';
import type { OrderRegistrationFormData } from '../types';
import type { Cart } from 'entities/cart';

interface UseOrderCheckoutParams {
	formData: OrderRegistrationFormData;
	checkoutItems: Cart[];
}

export const useOrderCheckout = ({ formData, checkoutItems }: UseOrderCheckoutParams) => {
	const [isOrdered, setIsOrdered] = useState(false);
	const [orderCheckout, setOrderCheckout] = useState<OrderCheckoutResponse | null>(null);
	const removeCartMany = useRemoveCartMany();
	const { formattedTime, isExpired } = useOrderTimer(orderCheckout?.order);

	useEffect(() => {
		if (isExpired && orderCheckout?.order) {
			router.push('/cart');
		}
	}, [isExpired, orderCheckout]);

	const handleCheckout = async () => {
		const isOnlinePayment = formData.paymentMethod === 'online';
		const {
			data: { data }
		} = await orderApi.checkout({
			products: checkoutItems.map((item) => ({ id: item.product.id, type: item.product.type })),
			userName: formData.name,
			phone: formData.phone,
			paymentMethod: isOnlinePayment ? 'online' : 'offline',
			email: formData.email,
			address: formData.address
		});

		setOrderCheckout(data);

		if (isOnlinePayment && data.checkout) {
			const params = {
				checkout_url: 'https://checkout.bepaid.by',
				token: data.checkout.token,
				closeWidget: async (status: string | null | undefined) => {
					if (status === 'successful') {
						setIsOrdered(true);
						removeCartMany(checkoutItems.map((item) => item.id));
					}
					if (status === 'failed') {
						// Handle failed payment if needed
					}
				}
			};
			new BeGateway(params).createWidget();
		} else {
			removeCartMany(checkoutItems.map((item) => item.id));
			setIsOrdered(true);
		}
	};

	return {
		isOrdered,
		orderCheckout,
		formattedTime,
		isExpired,
		handleCheckout
	};
};
