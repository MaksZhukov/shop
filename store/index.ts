import { makeAutoObservable } from 'mobx';
import { enableStaticRendering, MobXProviderContext } from 'mobx-react';
import { useContext } from 'react';
// import CartStore from './Cart';
import FavoriteStore from './FavoritesStore';
import ShoppingCartStore from './ShoppingCartStore';
import UserStore from './UserStore';
import { authService, favoritesService, shoppingCartService } from 'services/LocalStorageService';

enableStaticRendering(typeof window === 'undefined');

class RootStore {
	user: UserStore;
	// cart: CartStore;
	favorites: FavoriteStore;
	shoppingCart: ShoppingCartStore;
	isInitialRequestDone: boolean = false;
	constructor() {
		this.user = new UserStore(this, authService);
		this.favorites = new FavoriteStore(this, favoritesService);
		this.shoppingCart = new ShoppingCartStore(this, shoppingCartService);
		makeAutoObservable(this);
	}
	setIsInitialRequestDone() {
		this.isInitialRequestDone = true;
	}
}

export default RootStore;

export const store = new RootStore();

export function useStore() {
	return useContext(MobXProviderContext).store as RootStore;
}
