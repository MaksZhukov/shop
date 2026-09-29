import type { AxiosResponse } from 'axios';
import type { Product, ProductType } from '../model/product.model';
import type { ApiResponse, CollectionParams } from 'shared/api/types';

type StoredItem = { id: number; product: { id: number; type: ProductType } };
type FetchProducts = (params: CollectionParams) => Promise<AxiosResponse<ApiResponse<Product[]>>>;

/** Loads fresh products for items saved in local storage and reports the items whose product is gone or sold. */
export const fetchProductsByType = async (items: StoredItem[], fetchProducts: Record<ProductType, FetchProducts>) => {
	const types = Object.keys(fetchProducts) as ProductType[];
	const results = await Promise.all(
		types.map(async (type) => {
			const itemsOfType = items.filter((item) => item.product.type === type);
			if (!itemsOfType.length) {
				return { found: [], missingIds: [] };
			}
			const {
				data: { data }
			} = await fetchProducts[type]({
				filters: { id: itemsOfType.map((item) => item.product.id), sold: false },
				populate: ['images', 'brand']
			});
			const found = itemsOfType
				.map((item) => ({ id: item.id, product: data.find((product) => product.id === item.product.id) }))
				.filter((item): item is { id: number; product: Product } => !!item.product);
			const missingIds = itemsOfType
				.filter((item) => !data.some((product) => product.id === item.product.id))
				.map((item) => item.id);
			return { found, missingIds };
		})
	);
	return {
		found: results.flatMap((result) => result.found),
		missingIds: results.flatMap((result) => result.missingIds)
	};
};
