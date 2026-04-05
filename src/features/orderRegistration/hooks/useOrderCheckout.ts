import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi, type OrderCheckoutResponse } from 'entities/order';
import type { Cart } from 'entities/cart';
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
	removeCartMany: (cartItemIds: number[]) => void | Promise<void>;
}

export function useOrderCheckout({
	formData,
	checkoutItems,
	onChangeIsOrdered,
	isOrdered,
	removeCartMany
}: UseOrderCheckoutParams) {
	const [orderCheckout, setOrderCheckout] = useState<OrderCheckoutResponse | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const tokenRef = useRef<string | null>(null);
	const orderIdRef = useRef<number | null>(null);
	const queryClient = useQueryClient();
	const router = useRouter();
	const { formattedTime, isExpired } = useOrderTimer(orderCheckout?.order);

	useEffect(() => {
		tokenRef.current = token;
	}, [token]);

	useEffect(() => {
		orderIdRef.current = orderCheckout?.order?.id ?? null;
	}, [orderCheckout?.order?.id]);

	const { mutateAsync: reissueCheckoutToken, isPending: isReissuingCheckoutToken } = useMutation({
		mutationKey: ['reissueCheckoutToken'],
		mutationFn: ({ checkoutToken, orderId }: { checkoutToken: string; orderId: number }) =>
			orderApi.reissueCheckoutToken(checkoutToken, orderId)
	});
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
		await removeCartMany(checkoutItems.map((item) => item.id));
		await queryClient.invalidateQueries();
	};

	const onOrderError = async () => {
		if (!tokenRef.current || !orderIdRef.current) return;
		const { data } = await reissueCheckoutToken({ checkoutToken: tokenRef.current, orderId: orderIdRef.current });
		setToken(data.data.checkout.token);
	};

	const openWidget = (paymentToken: string) => {
		openPaymentWidget(BEPAID_CHECKOUT_URL, paymentToken, onOrderSuccess, onOrderError);
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
		handleCheckout,
		isReissuingCheckoutToken
	};
}
