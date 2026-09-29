import 'reflect-metadata';
import { computed, reatomBoolean } from '@reatom/core';
import { inject, injectable } from 'inversify';
import { CartStore } from 'entities/cart';
import { UserStore } from 'entities/user';

// Bound transient: the page resolves a fresh store on every visit, so a finished order does not stay on screen.
@injectable()
export class OrderRegistrationStore {
	readonly isOrdered = reatomBoolean(false, 'orderRegistration.isOrdered');

	readonly checkoutItems = computed(() => {
		const selectedItemIds = this.cartStore.selectedItemsForCheckout;
		return this.cartStore.items.filter((item) => !item.product.sold && selectedItemIds.includes(item.id));
	}, 'orderRegistration.checkoutItems');

	readonly totalAmount = computed(
		() => this.checkoutItems().reduce((acc, item) => acc + (item.product.discountPrice || item.product.price), 0),
		'orderRegistration.totalAmount'
	);

	readonly isLoading = computed(
		() => this.cartStore.isLoading || !this.userStore.isInitialRequestDone,
		'orderRegistration.isLoading'
	);

	// Nothing selected in the cart and no finished order: the page has nothing to check out.
	readonly hasNothingToCheckout = computed(
		() => !this.isOrdered() && this.checkoutItems().length === 0,
		'orderRegistration.hasNothingToCheckout'
	);

	constructor(
		@inject(CartStore) private readonly cartStore: CartStore,
		@inject(UserStore) private readonly userStore: UserStore
	) {}
}
