import { FC, ReactNode } from 'react';
import { Provider } from 'mobx-react';
import { makeAutoObservable } from 'mobx';
import { enableStaticRendering, MobXProviderContext } from 'mobx-react';
import { useContext } from 'react';
import { FavoriteStore } from 'entities/favorite';
import { CartStore } from 'entities/cart';
import { SparePartsCatalogFilterStore } from 'features/sparePartsCatalog';
import { UserStoreProvider } from './UserStoreProvider';

enableStaticRendering(typeof window === 'undefined');

export class RootStore {
	favorites: FavoriteStore;
	cart: CartStore;
	sparePartsCatalogFilters: SparePartsCatalogFilterStore;
	constructor() {
		this.favorites = new FavoriteStore();
		this.cart = new CartStore();
		this.sparePartsCatalogFilters = new SparePartsCatalogFilterStore();
		makeAutoObservable(this);
	}
}

export const store = new RootStore();

export function useStore() {
	return useContext(MobXProviderContext).store as RootStore;
}

export const StoreProvider: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<Provider store={store}>
			<UserStoreProvider>{children}</UserStoreProvider>
		</Provider>
	);
};
