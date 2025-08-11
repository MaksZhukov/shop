import { makeAutoObservable } from 'mobx';
import { enableStaticRendering, MobXProviderContext } from 'mobx-react';
import { useContext } from 'react';
// import CartStore from './Cart';
import FavoriteStore from './Favorites';
import UserStore from './User';
import { authService, favoritesService } from 'services/LocalStorageService';

enableStaticRendering(typeof window === 'undefined');

class RootStore {
	user: UserStore;
	// cart: CartStore;
	favorites: FavoriteStore;
	isInitialRequestDone: boolean = false;
	constructor() {
		this.user = new UserStore(this, authService);
		// this.cart = new CartStore(this);
		this.favorites = new FavoriteStore(this, favoritesService);
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
