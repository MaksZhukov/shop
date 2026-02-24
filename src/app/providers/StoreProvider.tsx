import { FC, ReactNode } from 'react';
import { Provider } from 'mobx-react';
import { makeAutoObservable } from 'mobx';
import { enableStaticRendering, MobXProviderContext } from 'mobx-react';
import { useContext } from 'react';
import { FavoriteStore } from 'entities/favorite';
import { CartStore } from 'entities/cart';
import { UserStore } from 'entities/user';
import { SparePartsCatalogFilterStore } from 'features/sparePartsCatalog';

enableStaticRendering(typeof window === 'undefined');

export class RootStore {
	user: UserStore;
	favorites: FavoriteStore;
	cart: CartStore;
	sparePartsCatalogFilters: SparePartsCatalogFilterStore;
	isInitialRequestDone: boolean = false;
	constructor() {
		this.user = new UserStore();
		this.favorites = new FavoriteStore();
		this.cart = new CartStore();
		this.sparePartsCatalogFilters = new SparePartsCatalogFilterStore();
		makeAutoObservable(this);
	}
	setIsInitialRequestDone() {
		this.isInitialRequestDone = true;
	}
}

export const store = new RootStore();

export function useStore() {
	return useContext(MobXProviderContext).store as RootStore;
}

export const StoreProvider: FC<{ children: ReactNode }> = ({ children }) => {
	return <Provider store={store}>{children}</Provider>;
};
