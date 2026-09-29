import { reatomComponent } from '@reatom/react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect, useRef } from 'react';
import { AsyncWrapper, Loader } from 'shared/ui';
import { BEPAID_WIDGET_URL, CART_PATH } from '../orderRegistration.constants';
import { useDI } from '../orderRegistration.di';
import { OrderRegistration } from './orderRegistration.component';

export const OrderRegistrationEntry = reatomComponent(() => {
	const { orderRegistrationStore, orderRegistrationService, onOrderPlaced, cartLoad } = useDI();
	const router = useRouter();
	const hasNothingToCheckout = orderRegistrationStore.hasNothingToCheckout();

	// start() resets the checkout, so it runs once per visit; the latest page callback is read through the ref.
	const onOrderPlacedRef = useRef(onOrderPlaced);
	onOrderPlacedRef.current = onOrderPlaced;
	useEffect(
		() => orderRegistrationService.start({ onOrderPlaced: (cartItemIds) => onOrderPlacedRef.current(cartItemIds) }),
		[orderRegistrationService]
	);

	useEffect(() => {
		if (hasNothingToCheckout && router.isReady) {
			router.push(CART_PATH);
		}
	}, [hasNothingToCheckout, router]);

	return (
		<AsyncWrapper loading={!cartLoad.ready() || orderRegistrationStore.isWaitingForSession() || hasNothingToCheckout} fallback={<Loader />}>
			<OrderRegistration />
			<Script async id='bepaid' strategy='afterInteractive' src={BEPAID_WIDGET_URL} />
		</AsyncWrapper>
	);
});
