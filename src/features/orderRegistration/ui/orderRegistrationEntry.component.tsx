import { reatomComponent } from '@reatom/react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect } from 'react';
import { AsyncWrapper, Loader } from 'shared/ui';
import { BEPAID_WIDGET_URL, CART_PATH } from '../orderRegistration.constants';
import { useDI } from '../orderRegistration.di';
import { OrderRegistration } from './orderRegistration.component';

export const OrderRegistrationEntry = reatomComponent(() => {
	const { orderRegistrationStore } = useDI();
	const router = useRouter();
	const hasNothingToCheckout = orderRegistrationStore.hasNothingToCheckout();

	useEffect(() => {
		if (hasNothingToCheckout && router.isReady) {
			router.push(CART_PATH);
		}
	}, [hasNothingToCheckout, router]);

	return (
		<AsyncWrapper loading={orderRegistrationStore.isLoading() || hasNothingToCheckout} fallback={<Loader />}>
			<OrderRegistration />
			<Script async id='bepaid' strategy='afterInteractive' src={BEPAID_WIDGET_URL} />
		</AsyncWrapper>
	);
});
