import type { Cart } from './model/cart.model';

/** Cart storage. `RemoteCartApi` for a signed-in user, `LocalCartApi` for a guest. */
export interface CartApi {
	load(): Promise<Cart[]>;
	add(item: Cart): Promise<Cart>;
	remove(item: Cart): Promise<void>;
	removeMany(ids: number[]): Promise<void>;
}
