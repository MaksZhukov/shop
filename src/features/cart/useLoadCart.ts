import { useCartStore, cartLocalStorage, CartService } from 'entities/cart';
import { useUserStore } from 'entities/user';
import { CabinService } from 'entities/cabin';
import { SparePartService } from 'entities/sparePart';
import { TireService } from 'entities/tire';
import type { ApiResponse } from 'shared/api/types';
import type { CollectionParams } from 'shared/api/types';
import type { Product } from 'entities/product';
import { WheelService } from 'entities/wheel';
import type { AxiosResponse } from 'axios';
import type { Cart, StorageCart } from 'entities/cart';
import { useCallback } from 'react';
import { inject } from './cart.di';

type CartLoadServices = {
	cartService: CartService;
	sparePartService: SparePartService;
	wheelService: WheelService;
	tireService: TireService;
	cabinService: CabinService;
};

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
	userStore: ReturnType<typeof useUserStore>,
	services: CartLoadServices
) => {
	cartStore.setIsLoading(true);
	if (userStore.id) {
		const {
			data: { data }
		} = await services.cartService.fetchShoppingCart(userStore.id);
		const cartItems = data.map((item) => ({
			id: item.id,
			product: item.product[0].product
		}));
		cartStore.setItems(cartItems);
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
					(params) => services.sparePartService.fetchSpareParts(params)
				),
				getShoppingCartByTypes(
					cartItems.filter((item) => item.product.type === 'wheel'),
					(params) => services.wheelService.fetchWheels(params)
				),
				getShoppingCartByTypes(
					cartItems.filter((item) => item.product.type === 'tire'),
					(params) => services.tireService.fetchTires(params)
				),
				getShoppingCartByTypes(
					cartItems.filter((item) => item.product.type === 'cabin'),
					(params) => services.cabinService.fetchCabins(params)
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
	const cartService = inject(CartService);
	const sparePartService = inject(SparePartService);
	const wheelService = inject(WheelService);
	const tireService = inject(TireService);
	const cabinService = inject(CabinService);
	return useCallback(
		() => loadCart(cartStore, userStore, { cartService, sparePartService, wheelService, tireService, cabinService }),
		[cartStore, userStore, cartService, sparePartService, wheelService, tireService, cabinService]
	);
};
