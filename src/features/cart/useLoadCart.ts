import { useCartStore } from 'entities/cart';
import { useUserStore } from 'entities/user';
import { cabinApi } from 'entities/cabin';
import { sparePartApi } from 'entities/sparePart';
import { tireApi } from 'entities/tire';
import type { ApiResponse } from 'shared/api/types';
import type { CollectionParams } from 'shared/api/types';
import type { Product } from 'entities/product';
import { wheelApi } from 'entities/wheel';
import type { AxiosResponse } from 'axios';
import { cartApi, cartLocalStorage } from 'entities/cart';
import type { Cart, StorageCart } from 'entities/cart';
import { useCallback } from 'react';

const getShoppingCartByTypes = async (
	cartItems: StorageCart[],
	fetchFunc: (params: CollectionParams) => Promise<AxiosResponse<ApiResponse<Product[]>>>
) => {
	let result: { data: Cart[]; irrelevantCartItemIDs: number[] } = { data: [], irrelevantCartItemIDs: [] };
	if (cartItems.length) {
		const {
			data: { data }
		} = await fetchFunc({
			filters: { id: cartItems.map((item) => item.product.id), sold: false },
			populate: ['images', 'brand']
		});
		result.irrelevantCartItemIDs = cartItems
			.filter((cartItem) => !data.some((item) => cartItem.product.id === item.id))
			.map((item) => item.id);
		result.data = cartItems
			.filter((cartItem) => data.some((item) => cartItem.product.id === item.id))
			.map((item) => ({
				id: item.id,
				product: data.find((el) => el.id === item.product.id) as Product
			}));
	}
	return result;
};

export const loadCart = async (
	cartStore: ReturnType<typeof useCartStore>,
	userStore: ReturnType<typeof useUserStore>
) => {
	cartStore.setIsLoading(true);
	if (userStore.id) {
		const {
			data: { data }
		} = await cartApi.fetchShoppingCart();
		cartStore.setItems(data);
	} else {
		const cartItems = cartLocalStorage.getCart();
		try {
			const [
				{ data: spareParts, irrelevantCartItemIDs: irrelevantCartItemsSparePartIDs },
				{ data: wheels, irrelevantCartItemIDs: irrelevantCartItemsWheelsIDs },
				{ data: tires, irrelevantCartItemIDs: irrelevantCartItemsTiresIDs },
				{ data: cabins, irrelevantCartItemIDs: irrelevantCartItemsCabinsIDs }
			] = await Promise.all([
				getShoppingCartByTypes(
					cartItems.filter((item) => item.product.type === 'sparePart'),
					sparePartApi.fetchSpareParts
				),
				getShoppingCartByTypes(
					cartItems.filter((item) => item.product.type === 'wheel'),
					wheelApi.fetchWheels
				),
				getShoppingCartByTypes(
					cartItems.filter((item) => item.product.type === 'tire'),
					tireApi.fetchTires
				),
				getShoppingCartByTypes(
					cartItems.filter((item) => item.product.type === 'cabin'),
					cabinApi.fetchCabins
				)
			]);

			cartLocalStorage.removeCartItems([
				...irrelevantCartItemsSparePartIDs,
				...irrelevantCartItemsCabinsIDs,
				...irrelevantCartItemsTiresIDs,
				...irrelevantCartItemsWheelsIDs
			]);

			cartStore.setItems([...spareParts, ...wheels, ...tires, ...cabins]);
		} catch (err) {
			console.error(err);
		}
	}
	cartStore.setIsLoading(false);
};

export const useLoadCart = () => {
	const cartStore = useCartStore();
	const userStore = useUserStore();
	return useCallback(() => loadCart(cartStore, userStore), [cartStore, userStore]);
};
