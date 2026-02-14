import { useEffect, useRef } from 'react';
import Router, { useRouter } from 'next/router';
import { orderApi } from 'entities/order';
import { LEAVE_CONFIRM_MESSAGE } from '../constants';

export function useUnpaidOrderGuard(hasUnpaidOnlineOrder: boolean, checkoutToken: string | null): void {
	const router = useRouter();
	const cancelFiredRef = useRef(false);

	useEffect(() => {
		if (!hasUnpaidOnlineOrder) return;
		cancelFiredRef.current = false;

		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			e.preventDefault();
		};

		const tryCancelOrder = () => {
			debugger;
			if (cancelFiredRef.current || checkoutToken == null) return;
			cancelFiredRef.current = true;
			orderApi.cancelOrderBeacon(checkoutToken);
		};

		const handlePageHide = (e: PageTransitionEvent) => {
			if (!e.persisted) tryCancelOrder();
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		window.addEventListener('pagehide', handlePageHide);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
			window.removeEventListener('pagehide', handlePageHide);
		};
	}, [hasUnpaidOnlineOrder, checkoutToken]);

	useEffect(() => {
		if (!hasUnpaidOnlineOrder) return;
		const handleRouteChangeStart = async (url: string) => {
			const stayUrl = router.asPath;
			if (url === stayUrl) return;
			if (!window.confirm(LEAVE_CONFIRM_MESSAGE)) {
				Router.events.emit('routeChangeError');
				Router.replace(stayUrl);
				throw new Error('Route change aborted by user');
			}
			if (checkoutToken != null) {
				await orderApi.cancelOrder(checkoutToken);
			}
		};
		Router.events.on('routeChangeStart', handleRouteChangeStart);
		return () => Router.events.off('routeChangeStart', handleRouteChangeStart);
	}, [hasUnpaidOnlineOrder, router.asPath, checkoutToken]);
}
