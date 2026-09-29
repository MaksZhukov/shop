import 'reflect-metadata';
import { atom, computed, reatomBoolean } from '@reatom/core';
import { inject, injectable } from 'inversify';
import { CartStore } from 'entities/cart';
import type { DeliveryMethod, OrderCheckoutResponse, PaymentMethod } from 'entities/order';
import { UserStore } from 'entities/user';
import { formatRemainingTime } from './lib/formatRemainingTime';
import { getCheckoutButtonText } from './lib/getCheckoutButtonText';
import { ORDER_PAYMENT_TIMEOUT_MS } from './orderRegistration.constants';
import type { OrderRegistrationFormData } from './types';

@injectable()
export class OrderRegistrationStore {
	readonly isOrdered = reatomBoolean(false, 'orderRegistration.isOrdered');
	readonly formData = atom<OrderRegistrationFormData>(() => this.createFormData(), 'orderRegistration.formData');
	readonly orderCheckout = atom<OrderCheckoutResponse | null>(null, 'orderRegistration.orderCheckout');
	readonly paymentToken = atom<string | null>(null, 'orderRegistration.paymentToken');
	readonly now = atom(() => Date.now(), 'orderRegistration.now');

	readonly checkoutItems = computed(() => {
		const selectedItemIds = this.cartStore.selectedItemsForCheckout;
		return this.cartStore.items.filter((item) => !item.product.sold && selectedItemIds.includes(item.id));
	}, 'orderRegistration.checkoutItems');

	readonly totalAmount = computed(
		() => this.checkoutItems().reduce((acc, item) => acc + (item.product.discountPrice || item.product.price), 0),
		'orderRegistration.totalAmount'
	);

	readonly isWaitingForSession = computed(
		() => !this.userStore.isInitialRequestDone,
		'orderRegistration.isWaitingForSession'
	);

	// Nothing selected in the cart and no finished order: the page has nothing to check out.
	readonly hasNothingToCheckout = computed(
		() => !this.isOrdered() && this.checkoutItems().length === 0,
		'orderRegistration.hasNothingToCheckout'
	);

	// An order exists, so the form is locked until it is paid or expires.
	readonly isFormLocked = computed(() => !!this.orderCheckout()?.order, 'orderRegistration.isFormLocked');

	readonly buttonText = computed(
		() => getCheckoutButtonText(this.formData().paymentMethod),
		'orderRegistration.buttonText'
	);

	readonly remainingTime = computed(() => {
		const createdAt = this.orderCheckout()?.order?.createdAt;
		if (!createdAt) {
			return null;
		}
		return Math.max(0, new Date(createdAt).getTime() + ORDER_PAYMENT_TIMEOUT_MS - this.now());
	}, 'orderRegistration.remainingTime');

	readonly isExpired = computed(() => this.remainingTime() === 0, 'orderRegistration.isExpired');

	readonly formattedRemainingTime = computed(() => {
		const remainingTime = this.remainingTime();
		return remainingTime === null || remainingTime === 0 ? null : formatRemainingTime(remainingTime);
	}, 'orderRegistration.formattedRemainingTime');

	readonly hasUnpaidOnlineOrder = computed(
		() => this.isFormLocked() && this.formData().paymentMethod === 'online' && !this.isOrdered(),
		'orderRegistration.hasUnpaidOnlineOrder'
	);

	/** `undefined` without an unpaid online order, otherwise its checkout token (`null` when the order has none). */
	readonly unpaidCheckoutToken = computed(() => {
		return this.hasUnpaidOnlineOrder() ? (this.orderCheckout()?.checkout?.token ?? null) : undefined;
	}, 'orderRegistration.unpaidCheckoutToken');

	constructor(
		@inject(CartStore) private readonly cartStore: CartStore,
		@inject(UserStore) private readonly userStore: UserStore
	) {}

	reset() {
		this.isOrdered.setFalse();
		this.formData.set(this.createFormData());
		this.orderCheckout.set(null);
		this.paymentToken.set(null);
		this.now.set(Date.now());
	}

	updateField<K extends keyof OrderRegistrationFormData>(field: K, value: OrderRegistrationFormData[K]) {
		this.formData.set((current) => ({ ...current, [field]: value }));
	}

	changeDeliveryMethod(deliveryMethod: DeliveryMethod) {
		this.formData.set((current) => ({
			...current,
			deliveryMethod,
			// Pickup payment only exists for pickup delivery.
			paymentMethod: deliveryMethod === 'delivery' && current.paymentMethod === 'pickup' ? 'online' : current.paymentMethod
		}));
	}

	changePaymentMethod(paymentMethod: PaymentMethod) {
		if (paymentMethod === 'pickup' && this.formData().deliveryMethod !== 'pickup') {
			return;
		}
		this.updateField('paymentMethod', paymentMethod);
	}

	private createFormData(): OrderRegistrationFormData {
		return {
			userType: 'individual',
			username: '',
			companyName: '',
			tin: '',
			phone: this.userStore.phone,
			email: this.userStore.email,
			deliveryMethod: 'delivery',
			address: this.userStore.address,
			comment: '',
			paymentMethod: 'online',
			uploadedFile: null
		};
	}
}
