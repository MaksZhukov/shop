import { useState, useEffect } from 'react';
import router from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import { orderApi, type OrderCheckoutResponse } from 'entities/order';
import { useOrderTimer } from './useOrderTimer';
import { useRemoveCartMany } from 'features/cart/useRemoveCartMany';
import type { OrderRegistrationFormData } from '../types';
import type { Cart } from 'entities/cart';

interface UseOrderCheckoutParams {
	formData: OrderRegistrationFormData;
	checkoutItems: Cart[];
	onChangeIsOrdered: (isOrdered: boolean) => void;
}

export const useOrderCheckout = ({ formData, checkoutItems, onChangeIsOrdered }: UseOrderCheckoutParams) => {
	const [orderCheckout, setOrderCheckout] = useState<OrderCheckoutResponse | null>(null);
	const queryClient = useQueryClient();
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
			userName: formData.username,
			phone: formData.phone,
			paymentMethod: formData.paymentMethod,
			email: formData.email,
			file: formData.uploadedFile,
			address: formData.address,
			comment: formData.comment,
			companyName: formData.companyName,
			tin: formData.tin,
			userType: formData.userType
		});

		setOrderCheckout(data);

		if (isOnlinePayment && data.checkout) {
			const params = {
				checkout_url: 'https://checkout.bepaid.by',
				token: data.checkout.token,
				closeWidget: async (status: string | null | undefined) => {
					if (status === 'successful') {
						onChangeIsOrdered(true);
						removeCartMany(checkoutItems.map((item) => item.id));
						await queryClient.invalidateQueries();
					}
					if (status === 'failed') {
						// Handle failed payment if needed
					}
				}
			};
			new BeGateway(params).createWidget();
		} else {
			removeCartMany(checkoutItems.map((item) => item.id));
			onChangeIsOrdered(true);
			await queryClient.invalidateQueries();
		}
	};

	return {
		orderCheckout,
		formattedTime,
		isExpired,
		handleCheckout
	};
};
