import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import { orderApi, type OrderCheckoutResponse } from 'entities/order';
import type { Cart } from 'entities/cart';
import { useRemoveCartMany } from 'features/cart/useRemoveCartMany';
import { useOrderTimer } from './useOrderTimer';
import { useUnpaidOrderGuard } from './useUnpaidOrderGuard';
import { openPaymentWidget } from '../lib/openPaymentWidget';
import { BEPAID_CHECKOUT_URL } from '../constants';
import type { OrderRegistrationFormData } from '../types';

interface UseOrderCheckoutParams {
	formData: OrderRegistrationFormData;
	checkoutItems: Cart[];
	onChangeIsOrdered: (isOrdered: boolean) => void;
	isOrdered: boolean;
}

export function useOrderCheckout({ formData, checkoutItems, onChangeIsOrdered, isOrdered }: UseOrderCheckoutParams) {
	const [orderCheckout, setOrderCheckout] = useState<OrderCheckoutResponse | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const queryClient = useQueryClient();
	const removeCartMany = useRemoveCartMany();
	const router = useRouter();
	const { formattedTime, isExpired } = useOrderTimer(orderCheckout?.order);

	const hasUnpaidOnlineOrder = !!orderCheckout?.order && formData.paymentMethod === 'online' && !isOrdered;

	const unpaidOrderCheckoutToken =
		hasUnpaidOnlineOrder && orderCheckout?.checkout?.token ? orderCheckout.checkout.token : null;

	useUnpaidOrderGuard(hasUnpaidOnlineOrder, unpaidOrderCheckoutToken);

	useEffect(() => {
		if (isExpired && orderCheckout?.order) {
			router.push('/cart');
		}
	}, [isExpired, orderCheckout?.order, router]);

	const onOrderSuccess = async () => {
		onChangeIsOrdered(true);
		removeCartMany(checkoutItems.map((item) => item.id));
		await queryClient.invalidateQueries();
	};

	const openWidget = (paymentToken: string) => {
		openPaymentWidget(BEPAID_CHECKOUT_URL, paymentToken, onOrderSuccess);
	};

	const handleCheckout = async () => {
		const isOnlinePayment = formData.paymentMethod === 'online';

		if (isOnlinePayment && token) {
			openWidget(token);
			return;
		}

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
			setToken(data.checkout.token);
			openWidget(data.checkout.token);
		} else {
			await onOrderSuccess();
		}
	};

	return {
		orderCheckout,
		formattedTime,
		isExpired,
		handleCheckout
	};
}
