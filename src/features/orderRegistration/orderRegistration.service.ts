import 'reflect-metadata';
import { action, withAsync, wrap } from '@reatom/core';
import { inject, injectable } from 'inversify';
import Router from 'next/router';
import { OrderService } from 'entities/order';
import { SnackbarService } from 'shared/services';
import { openPaymentWidget } from './lib/openPaymentWidget';
import {
	BEPAID_CHECKOUT_URL,
	CART_PATH,
	EMAIL_REGEX,
	FORM_EMAIL_ERROR,
	FORM_REQUIRED_ERROR,
	LEAVE_CONFIRM_MESSAGE
} from './orderRegistration.constants';
import { OrderRegistrationStore } from './orderRegistration.store';
import type { OrderRegistrationFormData } from './types';

const TIMER_TICK_MS = 1000;

export type OrderRegistrationStartOptions = {
	/** Called after a successful order with the ordered cart item ids. */
	onOrderPlaced: (cartItemIds: number[]) => Promise<void>;
};

const isBlank = (value: string | null | undefined) => !value?.trim();

@injectable()
export class OrderRegistrationService {
	readonly checkout = action(async () => {
		const formError = this.validateForm(this.store.formData());
		if (formError) {
			this.snackbarService.error(formError);
			return;
		}

		const formData = this.store.formData();
		const isOnlinePayment = formData.paymentMethod === 'online';
		const paymentToken = this.store.paymentToken();
		if (isOnlinePayment && paymentToken) {
			this.openWidget(paymentToken);
			return;
		}

		const {
			data: { data }
		} = await wrap(
			this.orderService.checkout({
				products: this.store.checkoutItems().map((item) => ({ id: item.product.id, type: item.product.type })),
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
			})
		);
		this.store.orderCheckout.set(data);

		if (isOnlinePayment && data.checkout) {
			this.store.paymentToken.set(data.checkout.token);
			this.openWidget(data.checkout.token);
		} else {
			await wrap(this.completeOrder());
		}
	}, 'orderRegistration.checkout').extend(withAsync());

	readonly reissuePaymentToken = action(async () => {
		const paymentToken = this.store.paymentToken();
		const orderId = this.store.orderCheckout()?.order?.id;
		if (!paymentToken || !orderId) {
			return;
		}
		const { data } = await wrap(this.orderService.reissueCheckoutToken(paymentToken, orderId));
		this.store.paymentToken.set(data.data.checkout.token);
	}, 'orderRegistration.reissuePaymentToken').extend(withAsync());

	private onOrderPlaced: OrderRegistrationStartOptions['onOrderPlaced'] = async () => {};
	private timerId: ReturnType<typeof setInterval> | null = null;
	private removeUnpaidOrderGuard: (() => void) | null = null;

	constructor(
		@inject(OrderService) private readonly orderService: OrderService,
		@inject(OrderRegistrationStore) private readonly store: OrderRegistrationStore,
		@inject(SnackbarService) private readonly snackbarService: SnackbarService
	) {}

	/** Starts a checkout session for the page. Returns the cleanup for unmount. */
	start({ onOrderPlaced }: OrderRegistrationStartOptions) {
		this.onOrderPlaced = onOrderPlaced;
		this.store.reset();

		const stopTimer = this.store.orderCheckout.subscribe((orderCheckout) => this.runPaymentTimer(!!orderCheckout?.order));
		const stopExpiryRedirect = this.store.isExpired.subscribe((isExpired) => {
			if (isExpired) {
				Router.push(CART_PATH);
			}
		});
		const stopUnpaidOrderGuard = this.store.unpaidCheckoutToken.subscribe((token) => this.guardUnpaidOrder(token));

		return () => {
			stopTimer();
			stopExpiryRedirect();
			stopUnpaidOrderGuard();
			this.runPaymentTimer(false);
			this.guardUnpaidOrder(undefined);
		};
	}

	validateForm(formData: OrderRegistrationFormData): string | null {
		const isLegal = formData.userType === 'legal';
		const hasMissingField =
			(!isLegal && isBlank(formData.username)) ||
			isBlank(formData.phone) ||
			isBlank(formData.email) ||
			(isLegal && (isBlank(formData.companyName) || !formData.uploadedFile)) ||
			(formData.deliveryMethod === 'delivery' && isBlank(formData.address)) ||
			!formData.paymentMethod;

		if (!isBlank(formData.email) && !EMAIL_REGEX.test(formData.email.trim())) {
			return FORM_EMAIL_ERROR;
		}
		return hasMissingField ? FORM_REQUIRED_ERROR : null;
	}

	private openWidget(paymentToken: string) {
		openPaymentWidget(
			BEPAID_CHECKOUT_URL,
			paymentToken,
			() => this.completeOrder(),
			() => this.reissuePaymentToken()
		);
	}

	private async completeOrder() {
		this.store.isOrdered.setTrue();
		await this.onOrderPlaced(this.store.checkoutItems().map((item) => item.id));
	}

	private runPaymentTimer(isRunning: boolean) {
		if (this.timerId) {
			clearInterval(this.timerId);
			this.timerId = null;
		}
		if (isRunning) {
			this.store.now.set(Date.now());
			this.timerId = setInterval(() => this.store.now.set(Date.now()), TIMER_TICK_MS);
		}
	}

	// While an online order is unpaid: warn before leaving, and cancel the order when the user leaves anyway.
	private guardUnpaidOrder(checkoutToken: string | null | undefined) {
		this.removeUnpaidOrderGuard?.();
		this.removeUnpaidOrderGuard = null;
		if (checkoutToken === undefined) {
			return;
		}

		let isCancelSent = false;
		const cancelOnPageHide = (event: PageTransitionEvent) => {
			if (event.persisted || isCancelSent || checkoutToken === null) {
				return;
			}
			isCancelSent = true;
			this.orderService.cancelOrderBeacon(checkoutToken);
		};
		const warnBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
		const confirmRouteChange = async (url: string) => {
			const stayUrl = Router.asPath;
			if (url === stayUrl) {
				return;
			}
			if (!window.confirm(LEAVE_CONFIRM_MESSAGE)) {
				Router.events.emit('routeChangeError');
				Router.replace(stayUrl);
				throw new Error('Route change aborted by user');
			}
			if (checkoutToken !== null) {
				await this.orderService.cancelOrder(checkoutToken);
			}
		};

		window.addEventListener('beforeunload', warnBeforeUnload);
		window.addEventListener('pagehide', cancelOnPageHide);
		Router.events.on('routeChangeStart', confirmRouteChange);
		this.removeUnpaidOrderGuard = () => {
			window.removeEventListener('beforeunload', warnBeforeUnload);
			window.removeEventListener('pagehide', cancelOnPageHide);
			Router.events.off('routeChangeStart', confirmRouteChange);
		};
	}
}
