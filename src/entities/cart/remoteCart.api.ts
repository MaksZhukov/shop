import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { SessionStore } from 'core/session';
import { api } from 'shared/api';
import { API_MAX_LIMIT } from 'shared/api/constants';
import type { ApiResponse } from 'shared/api/types';
import type { CartApi } from './cart.api';
import type { ApiCart, Cart } from './model/cart.model';

const CART_URL = 'shopping-cart';

@injectable()
export class RemoteCartApi implements CartApi {
	constructor(@inject(SessionStore) private readonly sessionStore: SessionStore) {}

	async load() {
		const {
			data: { data }
		} = await api.get<ApiResponse<ApiCart[]>>(CART_URL, {
			params: {
				pagination: { limit: API_MAX_LIMIT },
				populate: ['product.product.images', 'product.product.brand'],
				filters: { user: this.sessionStore.userId() }
			}
		});
		return data.map((item) => ({ id: item.id, product: item.product[0].product }));
	}

	async add(item: Cart) {
		const { type, id } = item.product;
		const {
			data: { data }
		} = await api.post<ApiResponse<Cart>>(CART_URL, {
			data: {
				product: [{ __component: `product.${type === 'sparePart' ? 'spare-part' : type}`, product: id }]
			}
		});
		return data;
	}

	async remove(item: Cart) {
		await api.delete(`${CART_URL}/${item.id}`);
	}

	async removeMany(ids: number[]) {
		if (ids.length) {
			await api.delete(CART_URL, { params: { ids } });
		}
	}
}
