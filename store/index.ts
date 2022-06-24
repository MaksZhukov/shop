import { makeAutoObservable } from 'mobx';
import { enableStaticRendering, MobXProviderContext } from 'mobx-react';
import { useContext } from 'react';
import CartStore from './Cart';
import FavoriteStore from './Favorites';
import NotificationStore from './Notification';
import UserStore from './User';

enableStaticRendering(typeof window === 'undefined');

class RootStore {
	user: UserStore;
	cart: CartStore;
	favorites: FavoriteStore;
	notification: NotificationStore;
	isInitialRequestDone: boolean = false;
	constructor() {
		this.user = new UserStore(this);
		this.cart = new CartStore(this);
		this.favorites = new FavoriteStore(this);
		this.notification = new NotificationStore(this);
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
